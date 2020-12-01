const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

// pembuatan App Express
const app = express();

// memparse reques content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors());

// mendefinisikan router
app.get('/', (req, res) => {
    res.json({"message": "Selamat datang Di Web server nodejs dan mongoDB"});
});

// require("./app/routes/tutorial.routes")(app)
require("./app/routes/user.routes")(app)

// listen for requests
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });