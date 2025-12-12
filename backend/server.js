const express = require("express");
const server = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/product");
const User = require("./models/user");

require("dotenv").config();
const { DB_URI, SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

server.get("/", (request, response) => {
  response.send("LIVE!");
});

// Login Route
server.post("/login", async (request, response) => {
  const { username, password } = request.body;
  try {
    // Find user
    const user = await User.findOne({ username });

    // If no user
    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    // Match password
    const match = await bcrypt.compare(password, user.password);

    // If no match
    if (!match) {
      return response.status(403).send({ message: "Incorrect credentials" });
    }

    // Token
    const jwtToken = jwt.sign({ id: user._id, username }, SECRET_KEY);
    return response.status(201).send({ message: "User Authenticated", token: jwtToken});
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Create New User Route
server.post("/create-user", async (request, response) => {
  const { username, password } = request.body;

  // If username is unique, else send error
  try {
    // Encrypt password for database storage
    const secretPassword = await bcrypt.hash(password, 15);

    // Assign new user
    const user = new User({
      username,
      password: secretPassword,
    });

    // Save new server
    await user.save();
    response.send({ message: "User Added Successfully " });
  } catch (error) {
    response.status(500).send({ message: "User Already Exists" });
  }
});

server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.status(200).send(result));
  } catch (error) {
    console.log(error.message);
  }
});

server.post("/add-product", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const id = crypto.randomUUID();
  const product = new Product({
    productName,
    brand,
    price,
    image,
    id,
  });

  try {
    await product
      .save()
      .then((result) =>
        response.status(201).send(`${productName} added\nwith id: ${id}`)
      );
  } catch (error) {
    console.log(error.message);
  }
});
server.post("/edit-product", async (request, response) => {
  const { productName, brand, image, price, id } = request.body;
  try {
    const productToken = jwt.sign({
      productName,
      brand,
      image,
      price,
      id,
    }, SECRET_KEY);
    response.status(201).send({token: productToken})
  } catch (error) {
    console.log(error.message);
  }
});

server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Product.findByIdAndDelete(id).then((result) => {
      console.log(result);
      response.status(200).send(result);
    });
  } catch (error) {
    console.log(error.message);
  }
});

server.patch("/products/:id", async (request, response) => {
  const prodId = request.params.id;
  const { productName, brand, image, price, id } = request.body;

  try {
    await Product.findByIdAndUpdate(prodId, {
      productName,
      brand,
      image,
      price,
      id,
    }).then((result) =>
      response.status(200).send(`${productName} edited\nwith id: ${prodId}`)
    );
  } catch (error) {
    console.log(error.message);
  }
});
