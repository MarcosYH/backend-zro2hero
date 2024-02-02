const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Temoignage = require("../db/temoignageModel");

const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser());

exports.createTemoignage = async (request, response) => {
  try {
    const { name, email, message } = request.body;

    const newTemoignage = new Temoignage({
      name,
      email,
      message,
    });
    await newTemoignage.save();
    response.status(201).json(newTemoignage);
  } catch (err) {
    response.status(500).json({ error: error.message });
  }
};

exports.getAllTemoignages = async (request, response) => {
  try {
    const temoignages = await Temoignage.find();
    response.status(200).json(temoignages);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.getOneTemoignage = async (request, response) => {
  try {
    const temoignage = await Temoignage.findById(request.params.id);
    if (!temoignage) {
      response.status(404).json({ message: "Temoignage not found" });
    } else {
      response.status(200).json(temoignage);
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.deleteTemoignage = async (request, response) => {
  try {
    const temoignage = await Temoignage.findByIdAndDelete(request.params.id);
    if (!temoignage) {
      response.status(404).json({ message: "Temoignage not found" });
    } else {
      response.status(200).json({ message: "Temoignage deleted" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.updateTemoignage = async (request, response) => {
  try {
    const temoignage = await Temoignage.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    if (!temoignage) {
      response.status(404).json({ message: "Temoignage not found" });
    } else {
      response.status(200).json(temoignage);
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};