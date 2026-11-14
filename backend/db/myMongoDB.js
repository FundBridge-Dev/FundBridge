import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  if (db) return db;

  const url = process.env.MONGO_URL;
  if (!url) {
    throw new Error("MONGO_URL is not set. Copy .env.example to .env.");
  }

  client = new MongoClient(url);
  await client.connect();
  db = client.db(process.env.DB_NAME || "fundbridge");
  console.log(`Connected to MongoDB database "${db.databaseName}"`);
  return db;
}

export function getDB() {
  if (!db) throw new Error("Call connectDB() before getDB().");
  return db;
}

export function getClient() {
  if (!client) throw new Error("Call connectDB() before getClient().");
  return client;
}

export async function closeDB() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}
