const musicRoutes=require('./routes/music')
const authRoutes = require("./routes/auth");
const express=require("express");
const cors= require("cors");
const dotenv= require("dotenv");
const  connectDB =require( "./config/db");
const adminroutes=require("./routes/admin")
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = 5000|| process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/music",musicRoutes)
app.use("/api/admin",adminroutes)
app.get("/", (req, res) => {
    res.send("🎵 Music Streaming API is running...");
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));