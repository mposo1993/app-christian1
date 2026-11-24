import { MongoClient } from 'mongodb';

let cached = globalThis._synaiMongo;
if (!cached) cached = globalThis._synaiMongo = { client: null };

export async function progressCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI не задано');
  if (!cached.client) cached.client = new MongoClient(uri, { maxPoolSize: 5 }).connect();
  const client = await cached.client;
  return client.db(process.env.MONGODB_DB || 'synai').collection('progress');
}
