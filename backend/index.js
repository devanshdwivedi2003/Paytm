import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { router as rootRouter } from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/banking-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/v1", rootRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
