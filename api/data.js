const { MongoClient } = require("mongodb");

let cached;
function getDb() {
  if (!cached) cached = new MongoClient(process.env.MONGODB_URI).connect();
  return cached.then((c) => c.db(process.env.MONGODB_DB || "signal_desk"));
}

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const opts = { projection: { _id: 0 } };
    const [signals, trades, account, groups] = await Promise.all([
      db.collection("signals").find({}, opts).sort({ created_at: -1 }).limit(1000).toArray(),
      db.collection("trades").find({}, opts).sort({ created_at: -1 }).limit(1000).toArray(),
      db.collection("account").findOne({ key: "main" }, opts),
      db.collection("groups").find({}, opts).toArray(),
    ]);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ signals, trades, account, groups });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};