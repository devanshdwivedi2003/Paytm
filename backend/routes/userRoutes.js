import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import { User } from "../db";
import JWT_SECRET from "../config";
import { authMiddleware } from "../middleware"
import { Account } from "../db";
const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "incorrect inputs",
    });
  }

  const existingUser = User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(411).json({
      message: "user already exist",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

      await Account.create({
        userid,
        balance: 1 + Math.random() * 10000,
      });

  const userid = user._id;
  const token = jwt.sign(
    {
      userid,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const user=User.findOne({
          username:req.body.username,
          password:req.body.password
  })

  if(user){
          const token=jwt.sign({
                    userid:user._id
          },JWT_SECRET)
          res.json({
                    token
          })
          return
}else{
          res.json({
                    message:"error while logging in"
          })
}

});


const updatebody=zod.object({
  password:zod.string().optional(),
  firstName:zod.string().optional(),
  lastName:zod.string().optional()
})

router.put("/",authMiddleware,async(req,res)=>{
      const {success}=updatebody.safeParse(req.body);
      if(!success){
        res.status(411).json({
          message:"error while updating the info"
        })
      }
      await User.updateOne({
        _id:req.userid
      },req.body);

      res.json({
        message:"info updated successfully"
      })

})

export default router;
