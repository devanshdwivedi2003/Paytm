import express from 'express';
import { rootRouter }  from './routes/index.js'
import cors from  'cors';


const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/v1",rootRouter)

const PORT=3000;
app.listen(PORT,()=>{
          console.log(`listening to port ${PORT}`)
})