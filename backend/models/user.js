const postgres = require("../postgres");

function from_handle(handle, callback) {
  postgres.reader_sql`
    SELECT * FROM users WHERE handle = ${handle}
  `.then(function (users) {
    if (users.length) {
      callback(users[0]);
    } else {
      callback(null);
    }
  });
};

function from_id(id, callback) {
  postgres.reader_sql`
    SELECT * FROM users WHERE id = ${id}
  `.then(function (users) {
    if (users.length) {
      callback(users[0]);
    } else {
      callback(null);
    }
  });
};

exports.from_handle = from_handle;
exports.from_id = from_id;
