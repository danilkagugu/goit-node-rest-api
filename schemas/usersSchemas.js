import Joi from "joi";

export const registerUsersSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});
export const repeatVerifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
