const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB URL
const MONGO_URL = "YOUR_MONGODB_CONNECTION_STRING_HERE";

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.error(err));

// Schema
const requestSchema = new mongoose.Schema({
  movieName: String,
  quality: String,
  subtitle: String,
  timestamp: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

// Routes
// Get all requests
app.get('/api/requests', async (req,res)=>{
  try{
    const requests = await Request.find().sort({timestamp:-1}); // latest first
    res.json(requests);
  } catch(err){
    res.status(500).json({error:"Failed to fetch requests"});
  }
});

// Add new request
app.post('/api/addRequest', async (req,res)=>{
  try{
    const { movieName, quality, subtitle } = req.body;
    if(!movieName) return res.status(400).json({error:"Movie name required"});

    const newRequest = new Request({ movieName, quality, subtitle });
    await newRequest.save();
    res.json({ success:true });
  } catch(err){
    console.error(err);
    res.status(500).json({error:"Failed to save request"});
  }
});

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
