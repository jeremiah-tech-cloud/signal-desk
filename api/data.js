module.exports = async (req, res) => {
  try {
    const r = await fetch(process.env.UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.UPSTASH_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(["GET", "snapshot"]),
    });
    const out = await r.json();
    if (out.error) throw new Error(out.error);
    const data = out.result ? JSON.parse(out.result) : { signals: [], trades: [], account: null, groups: [] };
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=5");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};