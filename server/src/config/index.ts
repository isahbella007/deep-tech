import Joi, { ObjectSchema } from "joi";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { ErrorBuilder } from "../utils/errorHandler/ErrorBuilder";

// Load environment variables from .env file
const envFilePath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config(); // fallback to default .env
}

// Define the schema for environment variables
const envSchema: ObjectSchema = Joi.object({
  PROD_URL: Joi.string().default('localhost:3000'),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required().description("Database URL"),
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "http", "debug")
    .default("info"),
  PASSPORT_SECRET: Joi.string().description('Passport secret').required(), 
}).unknown(); // allow other variables

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  throw ErrorBuilder.internal(`Config validation error: ${error.message}`);
}

// Define the configuration interface
interface Config {
  baseUrl: string;
  prodUrl?: string;
  env: string;
  port: number;
  databaseUrl: string;
  logLevel: string;
  passport: { 
    passportSecret: string
  }
  
}

// Export validated environment variables
const config: Config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  env: envVars.NODE_ENV as string,
  port: envVars.PORT as number,
  databaseUrl: envVars.MONGODB_URI as string,
  logLevel: envVars.LOG_LEVEL as string,
  passport: { 
    passportSecret: envVars.PASSPORT_SECRET as string
  }
};

Object.freeze(config);

export { config };