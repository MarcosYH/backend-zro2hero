const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Contact = require("../db/contactModel");

const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser());

exports.createContact = async (request, response) => {
  try {
    const { name, email, phone, sujet, message } = request.body;

    const newContact = new Contact({
      name,
      email,
      phone,
      sujet,
      message,
    });
    await newContact.save();
    response.status(201).json({message: "Request created successfully", newContact});
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.getAllContacts = async (request, response) => {
  try {
    const contacts = await Contact.find();
    response.status(200).json(contacts);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.getOneContact = async (request, response) => {
  try {
    const contact = await Contact.findById(request.params.id);
    if (!contact) {
      response.status(404).json({ message: "Contact not found" });
    } else {
      response.status(200).json(contact);
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.deleteContact = async (request, response) => {
  try {
    const contact = await Contact.findByIdAndDelete(request.params.id);
    if (!contact) {
      response.status(404).json({ message: "Contact not found" });
    } else {
      response.status(200).json({ message: "Contact deleted" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.updateContact = async (request, response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      response.status(404).json({ message: "Contact not found" });
    } else {
      response.status(200).json(contact);
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

