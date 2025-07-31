import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MONGO_DB_URl } from "./config.js";
import { router as rootRouter } from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
 mongoose
   .connect(
     MONGO_DB_URl,
     {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     }
   )
   .then(() => console.log("MongoDB connected"))
   .catch((err) => console.error(err));

app.use("/api/v1", rootRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
