const express = require('express')
const app = express();

const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");

const database=require("./config/database");
const cookieParser = require("cookie-parser");
//use cors so that backend entertain the request made by the frontend
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

dotenv.config();
const PORT=process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:3000",
    "https://studynotion-hosting1-1.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
);
//cloudinary connection
cloudinaryConnect();

//routes mount
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

//default route
app.get("/", (req, res) => {
    return res.json({
        status: "success",
        message:"Your server is up and running!",
    })
});

app.listen(PORT, () => {
     console.log("Server is up and running on port: " + PORT);
})








