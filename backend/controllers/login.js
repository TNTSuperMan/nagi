const user = require("../models/user");
const postgres = require("../postgres");
const bcrypt = require("bcryptjs");

function login(username, password, callback) {
  user.from_handle(username, function (user) {
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      callback({
        type: "forbidden",
      });
    } else {
      const authenticators = [];
      if (user.totp_secret) {
        authenticators.push("totp");
      }
      postgres.reader_sql`
        SELECT COUNT(*) FROM webauthn_credentials WHERE user_handle = ${user.id};
      `.then(function (webauthn_credentials) {
    if (parseInt(webauthn_credentials[0].count)) {
      authenticators.push("webauthn");
    }
    if (authenticators.length) {
      callback({
        type: "needs_2FA",
        next: authenticators,
      });
    } else {
      callback({
        type: "success",
        id: user.id,
      });
    }
  });
    }
  });
}

module.exports = login;
