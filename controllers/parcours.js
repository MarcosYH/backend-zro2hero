const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Parcours = require("../db/parcourModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

exports.createParcours = async (request, response) => {
  const { wording, description, image, categorie, level, time, timecategory } = request.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "parcours",
    });
    const nouveauParcours = new Parcours({
      wording,
      description,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      categorie,
      level,
      time,
      timecategory
    });

    const parcours = await nouveauParcours.save();

    response.status(201).json({
      message: "Parcours créé avec succès",
      parcours: parcours,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
};

exports.getAllParcours = async (request, response) => {
  try {
    const parcours = await Parcours.find();
    response.status(200).json(parcours);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.getOneParcours = async (req, res) => {
  try {
    const parcoursId = req.params.id;
    const parcours = await Parcours.findById(parcoursId);
    if (!parcours) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }
    res.status(200).json(parcours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateParcours = async (request, response) => {
  const { id } = request.params;
  const { wording, description, image, categorie } = request.body;

  try {
    const parcours = await Parcours.findByIdAndUpdate(
      id,
      { wording, description, image, categorie },
      { new: true }
    );

    if (!parcours) {
      return response.status(404).json({ error: "Parcours non trouvé" });
    }

    response
      .status(200)
      .json({ message: "Parcours mis à jour avec succès", parcours });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.deleteParcours = async (request, response) => {
  const { id } = request.params; // Récupérez l'ID du parcours à supprimer depuis les paramètres de l'URL

  try {
    const parcours = await Parcours.findByIdAndDelete(id);

    if (!parcours) {
      return response.status(404).json({ error: "Parcours non trouvé" });
    }

    response.status(200).json({ message: "Parcours supprimé avec succès" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
