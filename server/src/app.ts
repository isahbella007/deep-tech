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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
  // optionsSuccessStatus: 200,
}));


// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom middleware
// app.use(persistCartId);

// Trust first proxy
app.set('trust proxy', 1);

// Session management
app.use(session({ 
  secret: config.passport.passportSecret, 
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { 
    maxAge: 1000 * 60 * 30,  // 30 minutes expiration
    // secure: false,
    // sameSite: 'lax',
    secure: true, //for production/hosting, allow so that cookies are sent over https
    sameSite:  'none', //use this because the frontend and backend are on different domains in dev, comment out or set to lax
    httpOnly: true, // temporarily set to false for debugging
    domain: '.onrender.com' // Add this line
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

