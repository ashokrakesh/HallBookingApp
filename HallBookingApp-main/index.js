import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const URL = process.env.URL;

const Connection = async (req, res) => {
  const client = new MongoClient(URL);
  client.connect();
  console.log("Mongo Connected Successfully...!");
  return client;
};
const Client = await Connection();

app.get("/", async (req, res) => {
  const data = await Client.db("Hallbook")
    .collection("rooms")
    .find({})
    .toArray();
  res.send(data);
});

//Creating a room:
app.post("/create-room", async (req, res) => {
  try {
    const data = req.body;
    await Client.db("Hallbook").collection("rooms").insertOne(data);
    res.send("room created...!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
//Booking a room
app.post("/room-booking", async (req, res) => {
  try {
    const data = req.body;
    await Client.db("Hallbook").collection("bookingData").insertOne(data);
    res.send("booking done...!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
// List all the rooms with booked data
app.get("/roomsData", async (req, res) => {
  try {
    const data = await Client.db("Hallbook")
      .collection("bookingData")
      .find({})
      .toArray();
    res.send(data);
  } catch (error) {}
});

//List all the customer with booked data
app.get("/allCustomerData", async (req, res) => {
  try {
    const data = await Client.db("Hallbook")
      .collection("bookingData")
      .find({},{customerName:1,_id:0,date:0,startTime:0,endTime:0})
      .toArray();
    res.send(data);
  } catch (error) {}
});

// List how many times customer booked a room
app.get("/customer/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const data = await Client.db("Hallbook")
      .collection("bookingData")
      .find({ customerName: name })
      .toArray();
    res.send(data);
  } catch (error) {}
});
app.listen(PORT, () =>
  console.log(`Server started on the port number: ${PORT}`)
);
