const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Parcours = require("../db/parcourModel");

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

// exports.createParcours = (req, res, next) => {
//   const parcoursObject = JSON.parse(req.body.parcours);
//   delete parcoursObject._id; // Supprimez l'ID s'il est présent (si vous ne souhaitez pas permettre l'écrasement d'un document existant)

//   // Créez un nouvel objet Parcours avec les données du corps de la requête et le chemin de l'image
//   const parcours = new Parcours({
//     ...parcoursObject,
//     image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
//   });

//   parcours
//     .save()
//     .then(() => {
//       res
//         .status(201)
//         .json({ message: "Parcours enregistré avec succès !", parcours });
//     })
//     .catch((error) => {
//       res.status(400).json({ error });
//     });
// };

exports.createParcours = (request, response) => {
  const { wording, description, categorie } = request.body;
  
  // Vérifiez si un fichier a été téléchargé
  if (!request.file) {
    return response.status(400).json({ error: "Veuillez télécharger une image." });
  }

  const image = `${request.protocol}://${request.get('host')}/images/${request.file.filename}`;

  const nouveauParcours = new Parcours({
    wording,
    description,
    image,
    categorie,
  });

  nouveauParcours
    .save()
    .then((parcours) => {
      response.status(201).json({
        message: "Parcours créé avec succès",
        parcours: parcours,
      });
    })
    .catch((error) => {
      response.status(500).json({ error: error.message });
    });
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
