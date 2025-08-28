const postgres = require("postgres");

exports.reader_sql = postgres(process.env.POSTGRESQL_READER);
exports.writer_sql = postgres(process.env.POSTGRESQL_WRITER);
