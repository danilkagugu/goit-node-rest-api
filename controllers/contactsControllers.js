import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (contact === null) {
      return res.status(404).send("Contact Not Found");
    }
    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const removeContact = await Contact.findByIdAndDelete(contactId);
    if (removeContact === null) {
      return res.status(404).send("Contact Not Found");
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const addContact = await Contact.create(req.body);

    return res.status(201).send(addContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (result === null) {
      return res.status(404).send("Contact Not Found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};
