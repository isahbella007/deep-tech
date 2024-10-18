import express from "express"
import cors from "cors"
import passport from "passport"
import { ErrorHandler } from "./utils/errorHandler";
import { connectToDatabase } from "./db/mongodb";
import { logger } from "./utils/logger";
import helmet from "helmet";
import httpLogger from "./utils/httpLogger";
import { passportSetup } from "./config/passport";
import session from "express-session";
import { config } from "./config";
import routes from "./routes";
import cookieParser from "cookie-parser"
import { persistCartId } from "./middleware/persist";

const app = express();

// Security Headers
app.use(helmet());
app.use(cors({
  origin: [config.developmentClientId, config.clientId],
  credentials: true,
  // optionsSuccessStatus: 200,
}));

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom middleware
app.use(persistCartId);

// Session management
app.use(session({ 
  secret: config.passport.passportSecret, 
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: { 
    maxAge: 1000 * 60 * 30,  // 30 minutes expiration
    secure: false,
    sameSite: 'none'
    // secure: process.env.NODE_ENV === 'production',  // Secure cookies in production
    // httpOnly: true,   // Can't be accessed by JavaScript
  },
  name: 'sessionId' //session name
}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use(httpLogger);

// Routes
app.use(routes);


// Global Error Handlers
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    logger.info('MongoDB connected successfully');
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

export default app;

