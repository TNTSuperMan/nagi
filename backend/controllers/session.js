const user = require("../models/user");

const SESSION_EXPIRES_MS = 1000 * 60 * 60 * 24;
const CHALLENGE_EXPIRES_MS = 1000 * 60 * 3;

const session = {
  login(userId, req, callback) {
    req.session.regenerate(function (err) {
      if (err) {
        callback(err);
      } else {
        req.session.expires = Date.now() + SESSION_EXPIRES_MS;
        req.session.userId = userId;
        req.session.mode = "session";
        callback(null);
      }
    });
  },
  validate(req, callback) {
    if (req.session.expires < Date.now()) {
      req.session.destroy(function (err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, null);
        }
      });
    } else if(session.mode !== "session") {
      callback(null, null);
    } else {
      callback(null, session.userId);
    }
  },

  start_challenge(userId, req, callback) {
    req.session.regenerate(function (err) {
      if (err) {
        callback(err);
      } else {
        req.session.expires = Date.now() + CHALLENGE_EXPIRES_MS;
        req.session.userId = userId;
        req.session.mode = "challenge";
        callback(null);
      }
    });
  },
  validate_challenge(req, callback) {
    if (req.session.expires < Date.now()) {
      callback.destroy(function (err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, null);
        }
      });
    } else if(req.session.mode !== "challenge") {
      callback(null, null);
    } else {
      user.from_id(req.session.userId, function (user) {
        if (!user) {
          callback(null, null);
        } else {
          callback(null, user);
        }
      });
    }
  },
};

module.exports = session;
