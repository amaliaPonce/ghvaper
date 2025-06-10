const Joi = require('joi');

const envVarsSchema = Joi.object({
  PORT: Joi.number().integer().default(8080),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().integer().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().email().required(),
}).unknown();

module.exports = function validateEnv() {
  const { error } = envVarsSchema.validate(process.env, { allowUnknown: true });
  if (error) {
    throw new Error(`Environment variable validation error: ${error.message}`);
  }
};
