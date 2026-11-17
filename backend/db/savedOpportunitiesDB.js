import { ObjectId } from "mongodb";
import { getDB } from "./myMongoDB.js";

function saved() {
  return getDB().collection("savedOpportunities");
}

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function createSavedOpportunityIndexes() {
  await saved().createIndexes([
    { key: { userId: 1, opportunityId: 1 }, unique: true },
    { key: { opportunityId: 1 } },
  ]);
}

export async function findSavedForUser(userId) {
  return saved()
    .aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "opportunities",
          localField: "opportunityId",
          foreignField: "_id",
          as: "opportunity",
        },
      },
      { $unwind: "$opportunity" },
      { $sort: { "opportunity.deadline": 1 } },
    ])
    .toArray();
}

export async function findSavedById(id) {
  const _id = toObjectId(id);
  if (!_id) return null;
  return saved().findOne({ _id });
}

export async function insertSaved({ userId, opportunityId, status }) {
  const now = new Date();
  const doc = { userId, opportunityId, status, savedAt: now, updatedAt: now };
  const result = await saved().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateSavedStatus(id, status) {
  const _id = toObjectId(id);
  if (!_id) return null;
  return saved().findOneAndUpdate(
    { _id },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

export async function deleteSaved(id) {
  const _id = toObjectId(id);
  if (!_id) return false;
  const result = await saved().deleteOne({ _id });
  return result.deletedCount === 1;
}

export async function deleteSavedForOpportunities(opportunityIds) {
  const result = await saved().deleteMany({
    opportunityId: { $in: opportunityIds },
  });
  return result.deletedCount;
}
