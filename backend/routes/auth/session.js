const express = require("express");
const postgres = require("../../postgres.js");

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

  try{
    const result = await postgres.reader_sql`SELECT id, handle, displayName FROM users WHERE id = ${req.session.userId}`;
    if(!result.length){
      return req.session.destroy(err => {
        if(err){
          next(err);
        }
        res.json(null);
      });
    }else{
      res.json({
        id: result[0].id,
        handle: result[0].handle,
        displayName: result[0].displayName,
        expires: new Date(req.session.expires).toISOString(),
      });
    }
  }catch(err){
    next(err);
  }
});

module.exports = app;
