const express = require("express");
const core = require("cors");
const path = require('path');

const app = express();

let corsOption = {
  credentials: true,
};

app.use(core(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var dir = path.join(__dirname, '');

app.use(express.static(dir));

const db = require("./models");


db.mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

  
  
// app.get("/", (req, res) => {
//   res.json({ message: "Hello node appliction" });
// });


require('./routes/routes')(app);


app.get('/', (req, res) => {
  res.send('Hello user, welcome to Book management Application');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running or prot ${PORT}`);
});




