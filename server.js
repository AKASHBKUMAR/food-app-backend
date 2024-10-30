const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const foodRouter = require("./Routes/FoodRoute");
const userRouter = require("./Routes/UserRoute");

dotenv.config({path:"./config.env"});
mongoose.connect(process.env.DB_URL,{}).then(()=>{console.log("Mongo DB Connected successfully")}).catch((error)=>{console.log(error)});

const app = express();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

app.use("/api/food", foodRouter);
app.use("/image",express.static("uploads"));
app.use("/api/user",userRouter);

app.get("/",(req, res)=>{
  res.status(200).json({status:"success",mseeage:"server started running"});
})

app.listen(PORT,()=>{console.log(`Server started at PORT localhost://${PORT}`)})