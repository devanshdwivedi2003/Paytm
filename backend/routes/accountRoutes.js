import express from "express";
import mongoose from "mongoose";
import { Account } from "../db";
import { authMiddleware }  from "../middleware";

const router = express.Router();

router.get("/balance", (req, res) => {
  const account = Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;
  const account = Account.findOne({ userId: req.userId }).session(session);
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount=Account.findOne({userId:to}).session(session);
  if(!toAccount){
          await session.abortTransaction();
          return res.status(400).json({
                    message:"Invalid acoount"
          })
  }

  await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
  await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);


  await session.commitTransaction();
  res.json({
          message:"Transaction complete"
  })
});

export { router };
