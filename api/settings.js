const call = (cmd) => fetch(process.env.UPSTASH_URL, {
  method: "POST",
  headers: { Authorization: "Bearer " + process.env.UPSTASH_TOKEN, "Content-Type": "application/json" },
  body: JSON.stringify(cmd),
}).then((r) => r.json());

module.exports = async (req, res) => {
  try {
    const got = await call(["GET", "settings"]);
    let s = got.result ? JSON.parse(got.result) : { reverse: {} };
    if (req.method === "POST") {
      const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (!b.group) return res.status(400).json({ error: "Group missing" });
      s.reverse = s.reverse || {};
      if (b.reverse) s.reverse[b.group] = true; else delete s.reverse[b.group];
      const set = await call(["SET", "settings", JSON.stringify(s)]);
      if (set.error) throw new Error(set.error);
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(s);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};