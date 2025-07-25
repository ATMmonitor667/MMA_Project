import express from 'express';
import dotenv from 'dotenv'
dotenv.config({})
import pool from '../config/db'
import cors from "cors";
import fighterRoutes from './routes/fighterRoutes'
//import championFighter from './routes/championRoute'
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json())
//app.use('/api', fighterRoutes);
//app.use('/api', championFighter )
app.get('/', (req, res) => {
  console.log("Just testing nothing to see here");
  res.send("Just testing nothing to see here");
})

pool.connect();
app.use('/api',fighterRoutes)

app.listen(PORT, ()=>{
  console.log(`The application is running on port: ${PORT}`)
})