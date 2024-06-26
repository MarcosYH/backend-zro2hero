const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const User = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const Cookies = require("universal-cookie");

const dotenv = require("dotenv");

dotenv.config();
app.use(cookieParser());

exports.start = (request, response, next) => {
  response.json({ message: "Hey👋! This is backend for zero2hero!" });
  next();
};

exports.registerUser = (request, response) => {
  const { name, email, password, tel, role } = request.body;

  if (!name || !email || !password || !tel) {
    return response
      .status(400)
      .json({ message: "Tous les champs sont obligatoires." });
  }

  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return response
          .status(400)
          .json({ message: "Cet email est déjà enregistré." });
      }
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            tel: tel,
            role: role || "student",
          });
          user
            .save()
            .then((savedUser) => {
              const expirationTime = 10 * 60;
              const tokenvalidationregister = jwt.sign(
                {
                  userId: user._id,
                  code: crypto.randomBytes(20).toString("hex"),
                },
                process.env.JWT_SECRET,
                { expiresIn: expirationTime }
              );

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  // user: "wallacecoffi@gmail.com",
                  user: "zero2hero023@gmail.com",
                  // pass: "tqmakiwpamlcukhk",
                  pass: "gbaryinyavmewewj",
                },
              });
              const mailOptions = {
                from: "zero2hero",
                to: email,
                subject: "Validation de compte",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmation d'inscription</title>
                </head>
                <body style="font-family: Arial, sans-serif;">
                
                    <table style="max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse; width: 100%;">
                        <tr>
                            <td style="background-color: #f8f9fa; text-align: center; padding: 20px;">
                                <img src="https://res.cloudinary.com/dbx3mcmdp/image/upload/v1698390947/parcours/iiklkuigcwx9ibesloms.png" alt="Logo" style="max-width: 150px; height: auto;">
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #ffffff; padding: 40px;">
                                <h2 style="font-size: 24px; color: #333;">Bienvenue sur zero2hero, ${name} !</h2>
                                <p style="font-size: 16px; color: #555;">Merci de vous être inscrit sur <strong>zero2hero</strong>. Pour valider votre compte, veuillez cliquer sur le lien ci-dessous :</p>
                                <p style="text-align: center; margin-top: 30px;">
                                    <a href="https://zero2hero-ivory.vercel.app/validateUser/${tokenvalidationregister}" style="display: inline-block; text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Valider mon compte</a>
                                </p>
                                <p style="font-size: 14px; color: #777; margin-top: 30px;">Si vous n'avez pas créé de compte sur zero2hero, veuillez le signalé.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8f9fa; text-align: center; padding: 20px;">
                                <p style="font-size: 14px; color: #888;">Bénin | Cotonou | 2023 |
                                  Contact : +22969070735</p>
                                <p style="font-size: 14px; color: #888;">Copyright © 2023 Emes</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                
              `,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  response.status(500).json({
                    error:
                      "Une erreur s'est produite lors de l'envoi de l'e-mail",
                  });
                } else {
                  console.log("E-mail sent:", info.response);
                  response.status(201).json({
                    message:
                      "Utilisateur créé avec succès.Un e-mail de validation a été envoyé",
                    user: savedUser,
                    tokenvalidationregister,
                  });
                }
              });
            })
            .catch((error) => {
              response.status(500).json({
                message: "Erreur lors de la création de l'utilisateur.",
                error: error,
              });
            });
        })
        .catch((error) => {
          response.status(500).json({
            message: "Erreur lors du hachage du mot de passe.",
            error: error,
          });
        });
    })
    .catch((error) => {
      response.status(500).json({
        message: "Erreur lors de la vérification de l'email.",
        error: error,
      });
    });
};

exports.activeUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.userId });

    if (user) {
      console.log(user);
      if (user.isActivated) {
        console.log(
          "Compte déjà activé pour l'utilisateur avec l'ID : ",
          user._id
        );
        return res.status(200).json({ message: "Compte déjà activé." });
      } else {
        await User.updateOne(
          { _id: user._id },
          { $set: { isActivated: true } }
        );
        console.log("Compte activé pour l'utilisateur avec l'ID : ", user._id);
        return res
          .status(200)
          .json({ message: "Votre compte a été activé avec succès." });
      }
    } else {
      console.log("Lien de validation invalide.");
      return res.status(400).json({ message: "Lien de validation invalide." });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Lien de validation invalide." });
  }
};

exports.loginUser = (request, response) => {
  // Vérifier si l'email existe
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "Email non trouvé",
        });
      }
      if (!user.isActivated) {
        return response.status(403).send({
          message: "Compte non activé",
        });
      }

      // Comparer le mot de passe entré et le mot de passe haché trouvé
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            // Si les mots de passe ne correspondent pas
            return response.status(400).send({
              message: "Les mots de passe ne correspondent pas",
            });
          }

          // Créer le token JWT
          const tokenPayload = {
            userId: user._id,
            userEmail: user.email,
            userRole: user.role,
            isActivated: user.isActivated,
          };

          const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          user.token = token;
          user
            .save()
            .then(() => {
              response.status(200).send({
                message: "Login Successful",
                isActivated: user.isActivated,
                email: user.email,
                token,
                role: user.role,
              });
            })
            .catch((error) => {
              response.status(500).send({
                message: "Erreur de serveur interne",
                error,
              });
            });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Erreur de serveur interne",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Erreur de serveur interne",
        error,
      });
    });
};

exports.usersInfo = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ token: token });
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de l'utilisateur" });
  }
};

exports.forgetpassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Générer un jeton unique
    const token = crypto.randomBytes(20).toString("hex");

    // Mettre à jour le document utilisateur avec le jeton généré et l'expiration
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Le jeton expirera après 1 heure (3600000 ms)
    await user.save();

    // Configurer le transporteur de messagerie pour envoyer l'e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wallacecoffi@gmail.com",
        pass: "tqmakiwpamlcukhk",
      },
    });

    // Créer le contenu de l'e-mail
    const mailOptions = {
      from: "wallacecoffi@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f1f1f1;
          }
          
          .container {
              text-align: center;
              max-width: 600px;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
          }
          
          h1 {
              margin: 0;
              line-height: 24px;
              font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
              font-size: 20px;
              font-style: normal;
              font-weight: normal;
              color: #333333;
          }
          
          p {
              margin: 0;
              -webkit-text-size-adjust: none;
              -ms-text-size-adjust: none;
              font-family: Helvetica, 'Helvetica Neue', Arial, verdana, sans-serif;
              line-height: 24px;
              color: #666666;
              font-size: 16px;
          }
          
          .button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
          }
          a{
            color: #ffffff;  
        }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://sikiyi.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="img" width="175">
          <h1><strong>VOUS AVEZ OUBLIÉ VOTRE MOT DE PASSE ?</strong></h1>
          <p>Hey👋!</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le bouton ci-dessous pour modifier votre mot de passe :</p>
          <a class="button" href="https://authentification-eight.vercel.app/createnewpassword/${token}" target="_blank">RÉINITIALISER LE MOT DE PASSE</a>
      </div>
  </body>
  </html>
          `,
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "Une erreur s'est produite lors de l'envoi de l'e-mail",
        });
      } else {
        console.log("E-mail sent:", info.response);
        res.status(200).json({
          message: "Un e-mail de réinitialisation de mot de passe a été envoyé",
          token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Une erreur s'est produite lors du traitement de la demande",
    });
  }
};

exports.createnewpassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Trouver l'utilisateur correspondant au jeton de réinitialisation
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Jeton de réinitialisation invalide ou expiré" });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la réinitialisation du mot de passe",
    });
  }
};

exports.loginGoogle = async function (req, res, next) {
  const redirectURL = "https://auth-api-adk2.onrender.com/auth/google/callback";
  const GOOGLE_CLIENT_ID =
    "881382327006-7mbuorq3in23d3so4n6n6l1n4a4ni5ga.apps.googleusercontent.com";
  const GOOGLE_CLIENT_SECRET = "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";

  const oAuth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectURL
  );

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile  openid ",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

exports.callbackAfterloginGoogle = async function (req, res, next) {
  const code = req.query.code;

  try {
    const redirectURL =
      "https://auth-api-adk2.onrender.com/auth/google/callback";
    const GOOGLE_CLIENT_ID =
      "881382327006-7mbuorq3in23d3so4n6n6l1n4a4ni5ga.apps.googleusercontent.com";
    const GOOGLE_CLIENT_SECRET = "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";
    const oAuth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirectURL
    );

    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);
    console.info("Tokens acquired.");

    // j'utilise l'API Google pour obtenir les informations de l'utilisateur
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    const { id, name, email } = data;
    const cookies = new Cookies(req, res);
    // Utilisez le nom et l'email de l'utilisateur pour effectuer des opérations
    // telles que l'enregistrement dans la base de données

    const user = new User({
      name: name,
      email: email,
      googleID: id,
    });
    // save the new user
    user
      .save()
      // return success if the new user is added to the database successfully
      .then((result) => {
        //   create JWT token
        console.log(result, "User Created Successfully");
      });
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );
    user.token = token;
    res.cookie("auth_token", token, { httpOnly: true });
    // user.token=token;
    res.cookie("TOKEN", token);
    res.cookie("EMAIL", user.email);

    // Stocker le token et l'email de l'utilisateur dans les cookies
    cookies.set("TOKEN", token, { path: "/" });
    cookies.set("EMAIL", user.email, { path: "/" });

    // // catch error if the new user wasn't added successfully to the database
    // .catch((error) => {
    //   res.status(500).send({
    //     message: "Error creating user",
    //     error,
    //   });
    //   console.log(error, "Error creating user");
    // });
    console.log(data);
    res.redirect(`https://authentification-eight.vercel.app/welcome/${token}`);
    // res.redirect(`http://localhost:3001/welcome?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
    res.redirect("https://authentification-eight.vercel.app/error");
  }
};

// ------------User CRUD operations----------------

exports.createUser = function (req, res) {
  const { name, email, tel, role, isActivated } = req.body;

  function generateRandomPassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+";
    let generatepassword = "";
    const passwordLength = 8;
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatepassword += characters[randomIndex];
    }
    return generatepassword;
  }

  const generatepassword = generateRandomPassword();

  User.findOne({ email: email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    bcrypt.hash(generatepassword, 10).then((hashedPassword) => {
      const user = new User({
        name,
        email,
        tel,
        role: role || "student",
        isActivated: isActivated || false,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          sendEmail(email, name, generatepassword);
          const expirationTime = 10 * 60;
          const tokenvalidationregister = jwt.sign(
            {
              userId: user._id,
              code: crypto.randomBytes(20).toString("hex"),
            },
            process.env.JWT_SECRET,
            { expiresIn: expirationTime }
          );
          res.status(201).json({
            message: "User created successfully",
            user: result,
            tokenvalidationregister,
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "Error creating user", error });
        });
    });
  });
};

function sendEmail(email, name, password) {
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
    subject: "Création de compte",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f1f1f1;
            }
            
            .container {
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
            }
            
            h1 {
                margin: 0;
                line-height: 24px;
                font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                font-size: 20px;
                font-style: normal;
                font-weight: normal;
                color: #333333;
            }
            
            p {
                margin: 0;
                -webkit-text-size-adjust: none;
                -ms-text-size-adjust: none;
                font-family: Helvetica, 'Helvetica Neue', Arial, verdana, sans-serif;
                line-height: 24px;
                color: #666666;
                font-size: 16px;
            }
            
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
            a{
              color: #fff !important;  
          }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://res.cloudinary.com/dbx3mcmdp/image/upload/v1698390947/parcours/iiklkuigcwx9ibesloms.png" alt="img" width="175">
            <h1><strong>Bienvenue sur zero2hero, ${name} !</strong></h1>
            <p>Hey👋!</p>
            <p>Votre compte a été créé avec succès. Voici votre mot de passe :</p>
            <p style="font-size: 20px; color: #007bff; font-weight: bold;">${password}</p>
            <p>Connectez-vous à votre compte en utilisant votre adresse e-mail et ce mot de passe.</p>
            <a class="button" href="https://zero2hero-ivory.vercel.app/login" target="_blank">Se connecter</a>
        </div>
    </body>
    </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

exports.getAllUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.deleteOneUser = async function (req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.updateOneUser = async function (req, res) {
  const { id } = req.params;
  const { name, email, tel, role, isActivated } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, tel, role, isActivated },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" }, user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

exports.getOneUserById = async function (req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// ------------User count----------------

const countUsersByRole = async (role) => {
  try {
    const count = await User.countDocuments({ role });
    return count;
  } catch (error) {
    console.error(`Error counting users with role ${role}:`, error);
    throw error;
  }
};

exports.getUserCountByRole = async (req, res) => {
  const { role } = req.params;

  if (!["student", "admin", "teacher"].includes(role)) {
    return res.status(400).json({ error: "Invalid role parameter" });
  }
  try {
    const count = await countUsersByRole(role);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while counting users" });
  }
};

const userByRole = async (role) => {
  try {
    const users = await User.find({ role });
    return users;
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    throw error;
  }
};

exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;

  if (!["student", "admin", "teacher"].includes(role)) {
    return res.status(400).json({ error: "Invalid role parameter" });
  }
  try {
    const users = await userByRole(role);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};
