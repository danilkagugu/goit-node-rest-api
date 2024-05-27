import { isValidObjectId } from "mongoose";
import Contact from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";

const validateObjectId = (id) => {
  if (!isValidObjectId(id)) throw HttpError(400, `${id} is not a valid id`);
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    validateObjectId(contactId);

    const contact = await Contact.findOne({
      _id: contactId,
      owner: req.user.id,
    });
    if (!contact) throw HttpError(404);
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    validateObjectId(contactId);
    const removeContact = await Contact.findOneAndDelete({
      _id: contactId,
      owner: req.user.id,
    });
    if (!removeContact) throw HttpError(404);
    res.send(removeContact);
    res.status(204).send(removeContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user.id,
    };
    const addContact = await Contact.create(contact);

    return res.status(201).send(addContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .send({ message: "Body must have at least one field" });
    }
    validateObjectId(contactId);
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: req.user.id },
      req.body,
      {
        new: true,
      }
    );
    if (!result) throw HttpError(404);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
