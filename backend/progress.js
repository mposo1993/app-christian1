import { progressCollection } from './lib/db.js';

const ID_RE = /^[0-9a-f-]{36}$/i;
const MAX_BYTES = 100_000;

// GET  /api/progress?id=<uuid>  -> { data, updatedAt }
// PUT  /api/progress?id=<uuid>  body { data, updatedAt }
export default async function handler(req, res) {
  const id = String(req.query.id || '');
  if (!ID_RE.test(id)) return res.status(400).json({ error: 'bad id' });

  try {
    const col = await progressCollection();

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: id });
      return res.status(200).json({ data: doc?.data ?? null, updatedAt: doc?.updatedAt ?? 0 });
    }

    if (req.method === 'PUT') {
      const { data, updatedAt } = req.body || {};
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'bad data' });
      }
      if (JSON.stringify(data).length > MAX_BYTES) {
        return res.status(413).json({ error: 'too large' });
      }
      const at = Number(updatedAt) || Date.now();
      await col.updateOne(
        { _id: id, $or: [{ updatedAt: { $lt: at } }, { updatedAt: { $exists: false } }] },
        { $set: { data, updatedAt: at } },
        { upsert: false }
      ).then(async (r) => {
        if (r.matchedCount === 0) {
          // документа ще нема — створюємо; якщо є новіший — ігноруємо
          await col.updateOne({ _id: id }, { $setOnInsert: { data, updatedAt: at } }, { upsert: true }).catch(() => {});
        }
      });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server error' });
  }
}
