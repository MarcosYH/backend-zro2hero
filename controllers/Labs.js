const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Labs = require("../db/labsModel");

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

exports.createLab = async (req, res) => {
  try {
    const {
      wording,
      description,
      technologie,
      type,
      level,
      duration,
      auteur,
      score,
      image,
      services,
      type_access,
    } = req.body;

    const newLab = new Labs({
      wording,
      description,
      technologie,
      type,
      level,
      duration,
      auteur,
      score,
      image,
      services,
      type_access,
    });

    await newLab.save();
    res.status(201).json(newLab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Labs.find();
    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneLab = async (req, res) => {
  try {
    const lab = await Labs.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ error: "Laboratoire non trouvé" });
    }
    res.status(200).json(lab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
