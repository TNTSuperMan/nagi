const user = require("../models/user");

const SESSION_EXPIRES_MS = 1000 * 60 * 60 * 24;
const CHALLENGE_EXPIRES_MS = 1000 * 60 * 3;

const session = {
  login(userId, session, callback) {
    session.regenerate(function (err) {
      if (err) {
        callback(err);
      } else {
        session.expires = Date.now() + SESSION_EXPIRES_MS;
        session.userId = userId;
        session.mode = "session";
        callback(null);
      }
    });
  },
  validate(session, callback) {
    if (session.expires < Date.now()) {
      session.destroy(function (err) {
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

  start_challenge(userId, session, callback) {
    session.regenerate(function (err) {
      if (err) {
        callback(err);
      } else {
        session.expires = Date.now() + CHALLENGE_EXPIRES_MS;
        session.userId = userId;
        session.mode = "challenge";
        callback(null);
      }
    });
  },
  validate_challenge(session, callback) {
    if (session.expires < Date.now()) {
      callback.destroy(function (err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, null);
        }
      });
    } else if(session.mode !== "challenge") {
      callback(null, null);
    } else {
      user.from_id(session.userId, function (user) {
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
