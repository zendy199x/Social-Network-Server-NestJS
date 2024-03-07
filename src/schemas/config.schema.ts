import * as Joi from '@hapi/joi';

let environment = 'development';
if (process.env.NODE_ENV) {
  environment = process.env.NODE_ENV;
}

let configValidation;

if (['staging', 'production'].includes(environment)) {
  configValidation = {
    DATABASE_URL: Joi.string().required(),
    SENTRY_DNS: Joi.string().required(),
  };
} else {
  configValidation = {
    PORT: Joi.number(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432).required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    SENTRY_DNS: Joi.string().required(),
  };
}

export const configValidationSchema = Joi.object(configValidation);
