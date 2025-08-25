const express = require("express");
const pg = require("pg");

const app = express.Router();

app.post("/", async (req, res, next) => {
  if(Date.now() > req.session.expires){
    return req.session.destroy(err => {
      if(err){
        next(err);
      }
      res.json(null);
    });
  }
  if(req.session.mode !== "session"){
    return res.json(null);
  }

  const reader_client = new pg.Client(process.env.POSTGRESQL_READER);
  await reader_client.connect();
  try{
    const result = await reader_client.query("SELECT id, handle, displayName FROM users WHERE id = $1", [req.session.userId]);
    if(!result.rowCount){
      return req.session.destroy(err => {
        if(err){
          next(err);
        }
        res.json(null);
      });
    }else{
      res.json({
        id: result.rows[0].id,
        handle: result.rows[0].handle,
        displayName: result.rows[0].displayName,
        expires: new Date(req.session.expires).toISOString(),
      });
    }
  }catch(err){
    next(err);
  }finally{
    await reader_client.end();
  }
});

module.exports = app;
