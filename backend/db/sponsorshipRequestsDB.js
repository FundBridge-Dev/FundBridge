import { ObjectId } from "mongodb";
import { getDB } from "./myMongoDB.js";

const COLLECTION = "sponsorshipRequests";
const MAX_LIMIT = 50;

function sponsorshipRequests() {
  return getDB().collection(COLLECTION);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function createSponsorshipRequestIndexes() {
  const collection = sponsorshipRequests();

  const existingIndexes = await collection.listIndexes().toArray();
  const seedIndex = existingIndexes.find((index) => index.name === "seedKey_1");

  if (seedIndex && !seedIndex.partialFilterExpression) {
    await collection.dropIndex("seedKey_1");
  }

  await collection.createIndexes([
    { key: { eventDate: 1 } },
    { key: { eventType: 1 } },
    { key: { location: 1 } },
    { key: { authorId: 1, createdAt: -1 } },
    {
      key: { seedKey: 1 },
      unique: true,
      partialFilterExpression: {
        seedKey: { $type: "string" },
      },
    },
  ]);
}

export async function findSponsorshipRequests({
  q = "",
  eventType = "",
  location = "",
  minBudget,
  maxBudget,
  minAudienceSize,
  maxAudienceSize,
  dateFrom,
  dateTo,
  sort = "date",
  page = 1,
  limit = 20,
} = {}) {
  const filter = {};

  if (q) {
    const search = { $regex: escapeRegex(q), $options: "i" };

    filter.$or = [
      { eventType: search },
      { location: search },
      { sponsorBenefits: search },
      { description: search },
    ];
  }

  if (eventType) {
    filter.eventType = eventType;
  }

  if (location) {
    filter.location = { $regex: escapeRegex(location), $options: "i" };
  }

  if (Number.isFinite(minBudget)) {
    filter.budget = { ...(filter.budget || {}), $gte: minBudget };
  }

  if (Number.isFinite(maxBudget)) {
    filter.budget = { ...(filter.budget || {}), $lte: maxBudget };
  }

  if (Number.isFinite(minAudienceSize)) {
    filter.audienceSize = {
      ...(filter.audienceSize || {}),
      $gte: minAudienceSize,
    };
  }

  if (Number.isFinite(maxAudienceSize)) {
    filter.audienceSize = {
      ...(filter.audienceSize || {}),
      $lte: maxAudienceSize,
    };
  }

  if (dateFrom) {
    filter.eventDate = {
      ...(filter.eventDate || {}),
      $gte: new Date(`${dateFrom}T00:00:00.000Z`),
    };
  }

  if (dateTo) {
    const endDate = new Date(`${dateTo}T00:00:00.000Z`);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    filter.eventDate = {
      ...(filter.eventDate || {}),
      $lt: endDate,
    };
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), MAX_LIMIT);

  const sortOptions = {
    date: { eventDate: 1 },
    newest: { createdAt: -1 },
    budget: { budget: -1 },
    audience: { audienceSize: -1 },
  };

  const selectedSort = sortOptions[sort] || sortOptions.date;

  const [items, total] = await Promise.all([
    sponsorshipRequests()
      .find(filter)
      .sort(selectedSort)
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .toArray(),
    sponsorshipRequests().countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
}

export async function findSponsorshipRequestById(id) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return null;
  }

  return sponsorshipRequests().findOne({ _id: objectId });
}

export async function createSponsorshipRequest(data) {
  const now = new Date();

  const document = {
    authorId: data.authorId,
    eventType: data.eventType,
    eventDate: new Date(data.eventDate),
    budget: data.budget,
    amountRaised: data.amountRaised ?? 0,
    audienceSize: data.audienceSize,
    location: data.location,
    sponsorBenefits: data.sponsorBenefits,
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };

  const result = await sponsorshipRequests().insertOne(document);

  return {
    ...document,
    _id: result.insertedId,
  };
}

export async function updateSponsorshipRequest(id, authorId, data) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return null;
  }

  const updates = {
    eventType: data.eventType,
    eventDate: new Date(data.eventDate),
    budget: data.budget,
    audienceSize: data.audienceSize,
    location: data.location,
    sponsorBenefits: data.sponsorBenefits,
    description: data.description,
    updatedAt: new Date(),
  };

  const result = await sponsorshipRequests().findOneAndUpdate(
    {
      _id: objectId,
      authorId,
    },
    {
      $set: updates,
    },
    {
      returnDocument: "after",
    }
  );

  return result;
}

export async function updateAmountRaised(id, authorId, amountRaised) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return null;
  }

  const result = await sponsorshipRequests().findOneAndUpdate(
    {
      _id: objectId,
      authorId,
    },
    {
      $set: {
        amountRaised,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  return result;
}

export async function deleteSponsorshipRequest(id, authorId) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return false;
  }

  const result = await sponsorshipRequests().deleteOne({
    _id: objectId,
    authorId,
  });

  return result.deletedCount === 1;
}
