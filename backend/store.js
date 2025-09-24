const session = require("express-session");

class PostgresStore extends session.Store {
  constructor(options = {}) {
    super();
    this.reader = options.reader;
    this.writer = options.writer;
    this.ttl = options.ttl || 86400;
  }
  get(sid, callback) {
    this.reader`
      SELECT sess FROM sessions WHERE sid = ${sid} AND expires > NOW()
    `.then(function (res) {
    if (res.length) {
      callback(null, res[0].sess);
    } else {
      callback(null, null);
    }
  });
  }
  set(sid, sess, callback) {
    const expires = new Date(sess.expires ??= Date.now() + this.ttl * 1000);
    
    this.writer`
      INSERT INTO sessions (sid, sess, expires)
      VALUES (${sid}, ${sess}, ${new Date(expires)})
      ON CONFLICT (sid) DO UPDATE
      SET sess = ${sess}, expires = ${expires}
    `.then(function () {
    callback(null);
  });
  }
  destroy(sid, callback) {
    this.writer`
      DELETE FROM sessions WHERE sid = ${sid}
    `.then(function () {
    callback(null);
  });
  }
  touch(sid, sess, callback) {
    const expires = new Date(sess.expires ??= Date.now() + this.ttl * 1000);
    this.writer`
      UPDATE sessions SET expires = ${expires} WHERE sid = ${sid}
    `.then(function () {
    callback(null);
  });
  }
}

module.exports = PostgresStore;
