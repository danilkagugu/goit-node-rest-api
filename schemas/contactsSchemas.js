import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(4),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(8),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(4),
  email: Joi.string().email(),
  phone: Joi.string().min(8),
});
export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
