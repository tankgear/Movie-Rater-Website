const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const Film = require("./src/models/film_model");
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "films" });
});

app.get("/api/v1/films", async (req, res) => {
  const films = await Film.find({});
  res.json(films);
});

app.post("/api/v1/films", verifyToken, async (req, res) => {
  const film = new Film({ name: req.body.name, rating: req.body.rating });
  const savedFilm = await film.save();
  res.json(savedFilm);
});

app.post("/api/v1/login", (req, res) => {
  const user = {
    username: req.body.username
  }
  jwt.sign({ user }, 'FMmuICjms6', (err, token) => {
    res.json({
      token
    })
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, 'FMmuICjms6', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
      else {
        next();
      }
    })
  }
  else {
    res.sendStatus(403);
  }
}

module.exports = app;

