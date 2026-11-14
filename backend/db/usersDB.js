import { ObjectId } from "mongodb";
import { getDB } from "./myMongoDB.js";

function users() {
  return getDB().collection("users");
}

export async function createUserIndexes() {
  await users().createIndex({ username: 1 }, { unique: true });
}

export async function findUserByUsername(username) {
  return users().findOne({ username });
}

export async function findUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  return users().findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } }
  );
}

export async function createUser({ username, passwordHash }) {
  const result = await users().insertOne({
    username,
    passwordHash,
    createdAt: new Date(),
  });
  return { _id: result.insertedId, username };
}
