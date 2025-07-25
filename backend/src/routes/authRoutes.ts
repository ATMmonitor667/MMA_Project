import express from "express";


const router = express.Router();

router.get("/", function(req, res,)
{
  res.send("Hello There How was your day");
})


export default router;