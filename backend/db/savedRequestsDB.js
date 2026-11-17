import { ObjectId } from "mongodb";
import { getDB } from "./myMongoDB.js";

const COLLECTION = "savedRequests";
const MAX_LIMIT = 50;

function savedRequests() {
  return getDB().collection(COLLECTION);
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function createSavedRequestIndexes() {
  await savedRequests().createIndexes([
    {
      key: { userId: 1, requestId: 1 },
      unique: true,
    },
    {
      key: { userId: 1, updatedAt: -1 },
    },
  ]);
}

export async function findSavedRequestsByUser({
  userId,
  page = 1,
  limit = 20,
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), MAX_LIMIT);

  const filter = { userId };

  const [items, total] = await Promise.all([
    savedRequests()
      .aggregate([
        { $match: filter },
        { $sort: { updatedAt: -1 } },
        { $skip: (safePage - 1) * safeLimit },
        { $limit: safeLimit },
        {
          $lookup: {
            from: "sponsorshipRequests",
            localField: "requestId",
            foreignField: "_id",
            as: "request",
          },
        },
        {
          $unwind: {
            path: "$request",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray(),
    savedRequests().countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
}

export async function findSavedRequestById(id, userId) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return null;
  }

  return savedRequests().findOne({
    _id: objectId,
    userId,
  });
}

export async function findSavedRequestForUser(userId, requestId) {
  const objectId = validObjectId(requestId);

  if (!objectId) {
    return null;
  }

  return savedRequests().findOne({
    userId,
    requestId: objectId,
  });
}

export async function createSavedRequest({
  userId,
  requestId,
  status = "under_review",
}) {
  const objectId = validObjectId(requestId);

  if (!objectId) {
    return null;
  }

  const now = new Date();

  const document = {
    userId,
    requestId: objectId,
    status,
    createdAt: now,
    updatedAt: now,
  };

  const result = await savedRequests().insertOne(document);

  return {
    ...document,
    _id: result.insertedId,
  };
}

export async function updateSavedRequest(id, userId, status) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return null;
  }

  const result = await savedRequests().findOneAndUpdate(
    {
      _id: objectId,
      userId,
    },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  return result;
}

export async function deleteSavedRequest(id, userId) {
  const objectId = validObjectId(id);

  if (!objectId) {
    return false;
  }

  const result = await savedRequests().deleteOne({
    _id: objectId,
    userId,
  });

  return result.deletedCount === 1;
}
