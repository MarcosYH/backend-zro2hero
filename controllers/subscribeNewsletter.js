const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const SubscribeNewsletter = require("../db/subscribeNewsletterModel");
const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser());

exports.SubscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  const existingUser = await SubscribeNewsletter.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "Cet e-mail est déjà inscrit." });
  }

  const newUser = new SubscribeNewsletter({ email });
  const savedUser = await newUser.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "zero2hero023@gmail.com",
      pass: "gbaryinyavmewewj",
    },
  });

  const mailOptions = {
    from: "zero2hero",
    to: email,
    subject: "Confirmation d'inscription à la newsletter",
    html: `
      <!DOCTYPE html>
        <html>
            <head>
                <style>
                .container {
                    padding: 16px;
                    text-align: center;
                }
                .btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 16px 20px;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom:10px;
                    opacity: 0.8;
                }
                .btn:hover {
                    opacity: 1;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h2>Bienvenue sur Zero2Hero</h2>
                <p>Merci pour votre inscription à la newsletter.</p>
                <p>Vous recevrez désormais des mises à jour régulières sur nos nouveaux cours et parcours.</p>
                <a href="https://zero2hero-ivory.vercel.app/" class="btn">Visitez notre site</a>
                </div>
            </body>
        </html>

    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({
          error: "Une erreur s'est produite lors de l'envoi de l'e-mail",
        });
    } else {
      console.log("E-mail sent:", info.response);
      res
        .status(201)
        .json({
          message: "Inscription à la newsletter réussie.",
          user: savedUser,
        });
    }
  });
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await SubscribeNewsletter.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneSubscriber = async (req, res) => {
  try {
    const subscriber = await SubscribeNewsletter.findById(req.params.id);
    if (!subscriber) {
      res.status(404).json({ message: "Abonné non trouvé" });
    } else {
      res.status(200).json(subscriber);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await SubscribeNewsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      res.status(404).json({ message: "Abonné non trouvé" });
    } else {
      res.status(200).json({ message: "Abonné supprimé" }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
