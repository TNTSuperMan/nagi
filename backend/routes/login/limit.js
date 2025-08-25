const rateLimit = require("express-rate-limit");

module.exports = rateLimit.rateLimit({
  windowMs: 5 * 60 * 1000, // 3分
  max: 5,
  message: { error: "アクセスが多いです、しばらく待ってください" },
  standardHeaders: true,
  legacyHeaders: false,
});
