const session = require("express-session");

class PostgresStore extends session.Store {
  constructor(options = {}) {
    super();
    this.reader = options.reader;
    this.writer = options.writer;
    this.ttl = options.ttl || 86400;
  }
  async get(sid, callback) {
    try {
      const res = await this.reader`SELECT sess FROM sessions WHERE sid = ${sid} AND expires > NOW()`;
      callback(null, res[0]?.sess || null);
    } catch (err) {
      callback(err);
    }
  }
  async set(sid, sess, callback) {
    try {
      const expires = new Date(sess.expires ??= Date.now() + this.ttl * 1000);
      
      await this.writer`
        INSERT INTO sessions (sid, sess, expires)
        VALUES (${sid}, ${sess}, ${new Date(expires)})
        ON CONFLICT (sid) DO UPDATE
        SET sess = ${sess}, expires = ${expires}
      `;
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
  async destroy(sid, callback) {
    try {
      await this.writer`DELETE FROM sessions WHERE sid = ${sid}`;
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
  async touch(sid, sess, callback) {
    try {
      const expires = new Date(sess.expires ??= Date.now() + this.ttl * 1000);

      await this.writer`UPDATE sessions SET expires = ${expires} WHERE sid = ${sid}`;
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = PostgresStore;
