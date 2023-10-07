const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Parcours = require("../db/parcourModel");

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

exports.createParcours = async (request, response) => {
  try {
    const { wording, description, image, categorie } = request.body;
    const nouveauParcours = new Parcours({
      wording,
      description,
      image,
      categorie,
    });
    await nouveauParcours.save();
    response
      .status(201)
      .json({
        message: "Parcours créé avec succès",
        parcours: nouveauParcours,
      });
  } catch (error) {
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
  
      response.status(200).json({ message: "Parcours mis à jour avec succès", parcours });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
  
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
  }
  