import express from 'express';
import { accountRoutes }  from './accountRoutes.js'
import { userRoutes } from './userRoutes.js'


const router=express.Router();

router.use("/user",userRoutes);
router.use("/account",accountRoutes)



export {router}