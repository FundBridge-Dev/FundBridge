import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { findOpportunityById } from "../db/opportunitiesDB.js";
import {
  deleteSaved,
  findSavedById,
  findSavedForUser,
  insertSaved,
  updateSavedStatus,
} from "../db/savedOpportunitiesDB.js";
import { APPLICATION_STATUSES } from "../constants/opportunityOptions.js";
import { toPublicOpportunity } from "../utils/publicOpportunity.js";

const router = Router();
router.use(requireAuth);

function toPublicSaved(req, doc) {
  const item = {
    _id: doc._id,
    opportunityId: doc.opportunityId,
    status: doc.status,
    savedAt: doc.savedAt,
    updatedAt: doc.updatedAt,
  };
  if (doc.opportunity) {
    item.opportunity = toPublicOpportunity(req, doc.opportunity);
  }
  return item;
}

function isSavedOwner(req, doc) {
  return Boolean(doc && doc.userId.equals(req.user._id));
}

router.get("/", async (req, res) => {
  const items = await findSavedForUser(req.user._id);
  res.json(items.map((doc) => toPublicSaved(req, doc)));
});

router.post("/", async (req, res) => {
  const status = req.body?.status ?? "planning";
  if (!APPLICATION_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Choose a valid status." });
  }

  const opportunity = await findOpportunityById(req.body?.opportunityId);
  if (!opportunity) {
    return res.status(404).json({ error: "Opportunity not found" });
  }

  try {
    const created = await insertSaved({
      userId: req.user._id,
      opportunityId: opportunity._id,
      status,
    });
    res.status(201).json(toPublicSaved(req, { ...created, opportunity }));
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "You already saved this opportunity." });
    }
    throw error;
  }
});

router.put("/:id", async (req, res) => {
  const status = req.body?.status;
  if (!APPLICATION_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Choose a valid status." });
  }

  const existing = await findSavedById(req.params.id);
  if (!isSavedOwner(req, existing)) {
    return res.status(404).json({ error: "Saved opportunity not found" });
  }

  const updated = await updateSavedStatus(req.params.id, status);
  res.json(toPublicSaved(req, updated));
});

router.delete("/:id", async (req, res) => {
  const existing = await findSavedById(req.params.id);
  if (!isSavedOwner(req, existing)) {
    return res.status(404).json({ error: "Saved opportunity not found" });
  }

  await deleteSaved(req.params.id);
  res.status(204).end();
});

export default router;
