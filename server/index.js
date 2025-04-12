const express = require("express");

const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const subscriptionRoutes = require("./routes/subscription");
const contactRoutes = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//Connect database
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin:"http://localhost:3000",
//     credentials:true,
//   })
// )
// app.use(cors({
//   origin: ['http://localhost:5173'], // ✅ Correct frontend origin (Vite)
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// }));

// app.options('*', cors()); // ✅ Handles preflight requests

app.use(cors())

app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
  })
)

//connection cloudinary
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/reach", contactRoutes);

//route def

app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:"Server is connected and successfully running.",
  });
});

app.listen(PORT,()=>{
  console.log(`App is running at ${PORT}`)
})