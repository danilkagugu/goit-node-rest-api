import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", getOneContact);

contactsRouter.delete("/:contactId", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:contactId",
  validateBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateStatusContactSchema),
  updateContact
);

export default contactsRouter;
