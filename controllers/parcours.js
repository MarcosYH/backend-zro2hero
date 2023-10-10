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
 
exports.createParcours = async (request, response) => {
  const { wording, description, categorie } = request.body;
  console.log(request.file.path),
  console.log(request.file)
  // Vérifiez si un fichier a été téléchargé
  if (!request.file) {
    return response
      .status(400)
      .json({ error: "Veuillez télécharger une image." });
  }

  try {
    // Uploadez l'image sur Cloudinary
    const image = await cloudinary.uploader.upload(request.file.path);

    // Obtenez le lien d'accès à l'image
    const imageUrl = image.secure_url;
    console.log(imageUrl);

    const nouveauParcours = new Parcours({
      wording,
      description,
      image: imageUrl,
      categorie,
    });

    // Enregistrez le parcours dans la base de données
    const parcours = await nouveauParcours.save();

    response.status(201).json({
      message: "Parcours créé avec succès",
      parcours,
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
