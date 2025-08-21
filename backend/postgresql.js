const pg = require("pg");

exports.readerClient = new pg.Client(process.env.POSTGRESQL_READER);
exports.writerClient = new pg.Client(process.env.POSTGRESQL_WRITER);
