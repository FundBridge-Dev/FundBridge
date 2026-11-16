import { ObjectId } from "mongodb";
import { getDB } from "./myMongoDB.js";
import { deadlineRangeForStatus } from "../utils/deadlineStatus.js";

const SORTS = {
  "deadline-asc": { deadline: 1, _id: 1 },
  "deadline-desc": { deadline: -1, _id: 1 },
  "amount-desc": { amount: -1, _id: 1 },
  "amount-asc": { amount: 1, _id: 1 },
  newest: { createdAt: -1, _id: 1 },
};

export const SORT_KEYS = Object.keys(SORTS);

function opportunities() {
  return getDB().collection("opportunities");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function createOpportunityIndexes() {
  await opportunities().createIndexes([
    { key: { deadline: 1 } },
    { key: { amount: -1 } },
    { key: { createdAt: -1 } },
    { key: { type: 1, industry: 1, stage: 1 } },
    { key: { ownerId: 1 } },
  ]);
}

export async function findOpportunities({
  q,
  type,
  industry,
  stage,
  minAmount,
  maxAmount,
  equity,
  deadlineBefore,
  status,
  ownerId,
  sort,
  page = 1,
  limit = 12,
}) {
  const conditions = [];

  if (q) {
    const pattern = { $regex: escapeRegex(q), $options: "i" };
    conditions.push({
      $or: [
        { title: pattern },
        { organization: pattern },
        { description: pattern },
      ],
    });
  }
  if (type) conditions.push({ type });
  if (industry) conditions.push({ industry });
  if (stage) conditions.push({ stage });
  if (minAmount !== undefined) conditions.push({ amount: { $gte: minAmount } });
  if (maxAmount !== undefined) conditions.push({ amount: { $lte: maxAmount } });
  if (equity === "required") conditions.push({ equityRequired: true });
  if (equity === "none") conditions.push({ equityRequired: false });
  if (deadlineBefore) conditions.push({ deadline: { $lte: deadlineBefore } });

  const statusRange = deadlineRangeForStatus(status);
  if (statusRange) conditions.push({ deadline: statusRange });

  if (ownerId) conditions.push({ ownerId });

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const [items, total] = await Promise.all([
    opportunities()
      .find(filter)
      .sort(SORTS[sort] || SORTS["deadline-asc"])
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    opportunities().countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function findOpportunityById(id) {
  const _id = toObjectId(id);
  if (!_id) return null;
  return opportunities().findOne({ _id });
}

export async function insertOpportunity(doc) {
  const result = await opportunities().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateOpportunity(id, fields) {
  const _id = toObjectId(id);
  if (!_id) return null;
  return opportunities().findOneAndUpdate(
    { _id },
    { $set: fields },
    { returnDocument: "after" }
  );
}

export async function deleteOpportunity(id) {
  const _id = toObjectId(id);
  if (!_id) return false;
  const result = await opportunities().deleteOne({ _id });
  return result.deletedCount === 1;
}

export async function findSyntheticOpportunityIds() {
  const docs = await opportunities()
    .find({ isSynthetic: true }, { projection: { _id: 1 } })
    .toArray();
  return docs.map((doc) => doc._id);
}

export async function deleteSyntheticOpportunities() {
  const result = await opportunities().deleteMany({ isSynthetic: true });
  return result.deletedCount;
}

export async function insertManyOpportunities(docs) {
  const result = await opportunities().insertMany(docs);
  return result.insertedCount;
}
