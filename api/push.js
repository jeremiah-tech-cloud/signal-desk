module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!process.env.PUSH_SECRET || req.headers["x-push-secret"] !== process.env.PUSH_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const r = await fetch(process.env.UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.UPSTASH_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", "snapshot", body]),
    });
    const out = await r.json();
    if (out.error) throw new Error(out.error);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};