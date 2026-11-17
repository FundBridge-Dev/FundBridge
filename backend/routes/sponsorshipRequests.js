import { Router } from "express";
import {
  createSponsorshipRequest,
  deleteSponsorshipRequest,
  findSponsorshipRequestById,
  findSponsorshipRequests,
  updateAmountRaised,
  updateSponsorshipRequest,
} from "../db/sponsorshipRequestsDB.js";
import {
  createSavedRequest,
  deleteSavedRequest,
  findSavedRequestById,
  findSavedRequestForUser,
  findSavedRequestsByUser,
  updateSavedRequest,
} from "../db/savedRequestsDB.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const EVENT_TYPES = [
  "Hackathon",
  "Workshop",
  "Demo Day",
  "Conference",
  "Career Fair",
  "Product Launch",
];

const SAVED_STATUSES = ["under_review", "contacted", "approved", "declined"];

function userId(req) {
  return String(req.user._id);
}

function parseOptionalNumber(value) {
  if (value === undefined || value === "") {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function validateRequestBody(body) {
  const eventDate = new Date(body.eventDate);
  const budget = Number(body.budget);
  const audienceSize = Number(body.audienceSize);

  if (!EVENT_TYPES.includes(body.eventType)) {
    return "Invalid event type";
  }

  if (!body.eventDate || Number.isNaN(eventDate.getTime())) {
    return "A valid event date is required";
  }

  if (!Number.isFinite(budget) || budget <= 0) {
    return "Budget must be greater than zero";
  }

  if (!Number.isInteger(audienceSize) || audienceSize < 0) {
    return "Audience size must be a non-negative integer";
  }

  if (!body.location || body.location.trim().length === 0) {
    return "Location is required";
  }

  if (!body.sponsorBenefits || body.sponsorBenefits.trim().length === 0) {
    return "Sponsor benefits are required";
  }

  if (!body.description || body.description.trim().length === 0) {
    return "Description is required";
  }

  if (body.description.length > 1000) {
    return "Description cannot exceed 1000 characters";
  }

  return null;
}

function requestFields(body) {
  return {
    eventType: body.eventType,
    eventDate: body.eventDate,
    budget: Number(body.budget),
    audienceSize: Number(body.audienceSize),
    location: body.location.trim(),
    sponsorBenefits: body.sponsorBenefits.trim(),
    description: body.description.trim(),
  };
}

router.get("/saved", requireAuth, async (req, res, next) => {
  try {
    const result = await findSavedRequestsByUser({
      userId: userId(req),
      page: req.query.page,
      limit: req.query.limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await findSponsorshipRequests({
      q: req.query.q?.trim() || "",
      eventType: req.query.eventType?.trim() || "",
      location: req.query.location?.trim() || "",
      minBudget: parseOptionalNumber(req.query.minBudget),
      maxBudget: parseOptionalNumber(req.query.maxBudget),
      minAudienceSize: parseOptionalNumber(req.query.minAudienceSize),
      maxAudienceSize: parseOptionalNumber(req.query.maxAudienceSize),
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sort: req.query.sort || "date",
      page: req.query.page,
      limit: req.query.limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const request = await findSponsorshipRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({
        error: "Sponsorship request not found",
      });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const validationError = validateRequestBody(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const request = await createSponsorshipRequest({
      ...requestFields(req.body),
      authorId: userId(req),
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const validationError = validateRequestBody(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existing = await findSponsorshipRequestById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        error: "Sponsorship request not found",
      });
    }

    if (existing.authorId !== userId(req)) {
      return res.status(403).json({
        error: "You can only edit your own sponsorship requests",
      });
    }

    const updated = await updateSponsorshipRequest(
      req.params.id,
      userId(req),
      requestFields(req.body)
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/amount-raised", requireAuth, async (req, res, next) => {
  try {
    const amountRaised = Number(req.body.amountRaised);

    if (!Number.isFinite(amountRaised) || amountRaised < 0) {
      return res.status(400).json({
        error: "Amount raised must be a non-negative number",
      });
    }

    const existing = await findSponsorshipRequestById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        error: "Sponsorship request not found",
      });
    }

    if (existing.authorId !== userId(req)) {
      return res.status(403).json({
        error: "You can only update your own sponsorship requests",
      });
    }

    if (amountRaised > existing.budget) {
      return res.status(400).json({
        error: "Amount raised cannot exceed the budget",
      });
    }

    const updated = await updateAmountRaised(
      req.params.id,
      userId(req),
      amountRaised
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await findSponsorshipRequestById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        error: "Sponsorship request not found",
      });
    }

    if (existing.authorId !== userId(req)) {
      return res.status(403).json({
        error: "You can only delete your own sponsorship requests",
      });
    }

    await deleteSponsorshipRequest(req.params.id, userId(req));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post("/:id/save", requireAuth, async (req, res, next) => {
  try {
    const request = await findSponsorshipRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({
        error: "Sponsorship request not found",
      });
    }

    const existing = await findSavedRequestForUser(userId(req), req.params.id);

    if (existing) {
      return res.status(409).json({
        error: "Request is already saved",
      });
    }

    const saved = await createSavedRequest({
      userId: userId(req),
      requestId: req.params.id,
    });

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

router.patch("/saved/:id", requireAuth, async (req, res, next) => {
  try {
    if (!SAVED_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        error: "Invalid saved-request status",
      });
    }

    const saved = await findSavedRequestById(req.params.id, userId(req));

    if (!saved) {
      return res.status(404).json({
        error: "Saved request not found",
      });
    }

    const updated = await updateSavedRequest(
      req.params.id,
      userId(req),
      req.body.status
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/saved/:id", requireAuth, async (req, res, next) => {
  try {
    const saved = await findSavedRequestById(req.params.id, userId(req));

    if (!saved) {
      return res.status(404).json({
        error: "Saved request not found",
      });
    }

    await deleteSavedRequest(req.params.id, userId(req));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
