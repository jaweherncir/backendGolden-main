const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const jumlageRoutes = require("./routes/jumlage.routes");
const invitationRoutes = require("./routes/invitation.routes");
const notificationRoutes = require("./routes/notification.routes");
const evenementRoutes = require("./routes/evenement.routes");
const evenementPrivesRoutes = require("./routes/evenemenetprive.routes");

const conversationRoutes = require("./routes/Conversation.routes");
const messageRoutes = require("./routes/Message.routes");
const EwalletRoutes = require("./routes/Ewallet.routes");
const AlbumRoutes = require("./routes/album.routes");
const RencontresRoutes = require("./routes/rencontres.routes");
const PageProRoutes = require("./routes/pagepro.routes");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);
app.use("/public", express.static(path.join(__dirname, "uploads")));
require("./notification.js");
const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//jwt
//assure le securite la connection de user
app.get("*", checkUser); //cheker si user bien le token qui correspandt a une idee
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});
app.use("/uploads", express.static("uploads"));
//routes

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/jumlage", jumlageRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/notif", notificationRoutes);
app.use("/api/event", evenementRoutes);
app.use("/api/event/prive", evenementPrivesRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/ewallet", EwalletRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/rencontre", RencontresRoutes);
app.use("/api/pagepro", PageProRoutes);

//Server

server.listen(8000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
