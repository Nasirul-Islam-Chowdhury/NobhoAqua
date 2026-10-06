import "server-only";
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI environment variable");

const DB_NAME = process.env.MONGODB_DB ?? "nobhoaqua";

// Cached across invocations on the same warm serverless instance (and across
// HMR reloads in `next dev`) so we don't open a fresh connection per request
// and exhaust the cluster's connection limit on cold starts.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(uri!, { maxPoolSize: 5 });
  return client.connect();
}

export const clientPromise: Promise<MongoClient> =
  globalThis._mongoClientPromise ?? (globalThis._mongoClientPromise = createClientPromise());

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}
