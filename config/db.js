const mongoose = require("mongoose");

// mongoose.connect(process.env.DB_URL,
//      {
//          useNewUrlParser: true,
//          useUnifiedTopology: true,
//          useCreateIndex: true,
//          useFindAndModify: false,
//
//      }
//      ).then(()=> console.log("connected to MongoDB"))
//       .catch((err) => console.log("Failed to connect to MongoDB",err));
const uri = process.env.DB_URL
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,

    }
).then(()=> console.log("connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB",err));


