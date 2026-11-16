import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  SORT_KEYS,
  deleteOpportunity,
  findOpportunities,
  findOpportunityById,
  insertOpportunity,
  updateOpportunity,
} from "../db/opportunitiesDB.js";
import {
  DEADLINE_STATUS_FILTERS,
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  STARTUP_STAGES,
} from "../constants/opportunityOptions.js";
import {
  isOpportunityOwner,
  toPublicOpportunity,
} from "../utils/publicOpportunity.js";
import {
  parseDateInput,
  validateOpportunity,
} from "../validation/validateOpportunity.js";

const router = Router();
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function toPositiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function optionalAmount(value) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function pickAllowed(value, allowed) {
  return allowed.includes(value) ? value : "";
}

router.get("/", async (req, res) => {
  const mine = req.query.mine === "true";
  if (mine && !req.isAuthenticated()) {
    return res.status(401).json({ error: "Please log in first" });
  }

  const result = await findOpportunities({
    q: typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "",
    type: pickAllowed(req.query.type, OPPORTUNITY_TYPES),
    industry: pickAllowed(req.query.industry, INDUSTRIES),
    stage: pickAllowed(req.query.stage, STARTUP_STAGES),
    minAmount: optionalAmount(req.query.minAmount),
    maxAmount: optionalAmount(req.query.maxAmount),
    equity: pickAllowed(req.query.equity, ["required", "none"]),
    deadlineBefore: parseDateInput(req.query.deadlineBefore),
    status: pickAllowed(req.query.status, DEADLINE_STATUS_FILTERS),
    ownerId: mine ? req.user._id : null,
    sort: pickAllowed(req.query.sort, SORT_KEYS) || "deadline-asc",
    page: toPositiveInt(req.query.page, 1),
    limit: Math.min(toPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT),
  });

  res.json({
    ...result,
    items: result.items.map((doc) => toPublicOpportunity(req, doc)),
  });
});

router.get("/:id", async (req, res) => {
  const opportunity = await findOpportunityById(req.params.id);
  if (!opportunity) {
    return res.status(404).json({ error: "Opportunity not found" });
  }
  res.json(toPublicOpportunity(req, opportunity));
});

router.post("/", requireAuth, async (req, res) => {
  const { errors, value } = validateOpportunity(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" "), errors });
  }

  const now = new Date();
  const created = await insertOpportunity({
    ...value,
    ownerId: req.user._id,
    ownerName: req.user.username,
    isSynthetic: false,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json(toPublicOpportunity(req, created));
});

router.put("/:id", requireAuth, async (req, res) => {
  const existing = await findOpportunityById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Opportunity not found" });
  }
  if (!isOpportunityOwner(req, existing)) {
    return res
      .status(403)
      .json({ error: "You can only edit opportunities you posted" });
  }

  const { errors, value } = validateOpportunity(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" "), errors });
  }

  const updated = await updateOpportunity(req.params.id, {
    ...value,
    updatedAt: new Date(),
  });
  res.json(toPublicOpportunity(req, updated));
});

router.delete("/:id", requireAuth, async (req, res) => {
  const existing = await findOpportunityById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Opportunity not found" });
  }
  if (!isOpportunityOwner(req, existing)) {
    return res
      .status(403)
      .json({ error: "You can only delete opportunities you posted" });
  }

  await deleteOpportunity(req.params.id);
  res.status(204).end();
});

export default router;
