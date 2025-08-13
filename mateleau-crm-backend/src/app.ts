import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './swagger';
import helmet from 'helmet';
import { apiLimiter, loginLimiter, loginSlowdown } from './security/rateLimit';
import 'dotenv/config';
// Import routes
import userRoutes from './routes/userRoutes';
import diveRoutes from './routes/diveRoutes';
import authRoutes from './routes/authRoutes';
import boatRoutes from './routes/boatRoutes'; // Importer les routes de Boat
import divingGroupRoutes from './routes/divingGroupRoutes';
import diverRoutes from './routes/diverRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import availabilityRoutes from './routes/availabityRoutes';
import dashboardRoutes from './routes/dashboardRoute'; // Importer les routes de Today
import taskRoutes from './routes/taskRoutes';
import spotRoutes from './routes/spotRoutes';
import { requestId, httpLogger, errorLogger } from './logging/logger';
import mongoSanitize from 'express-mongo-sanitize';

// Create an instance of Express
const app: Application = express();

// --- Security Middleware ---
// Helmet : sécurise les en-têtes HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' }, // images non cross-origin
}));

if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts({ maxAge: 15552000 })); // ~180 jours
}

app.disable('x-powered-by');


// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({
  origin: ["http://localhost:4200","https://crm-mateleau-isvbf.ondigitalocean.app/"], // Autorise uniquement votre frontend
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true 
}));

app.use(requestId);
app.use(httpLogger);

app.use(express.json({ limit: '1mb' })); // limite taille payload

app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(mongoSanitize());

 // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/dives', diveRoutes);
app.use('/api/auth', loginSlowdown, loginLimiter, authRoutes);
app.use('/api/diving-groups', divingGroupRoutes);
app.use('/api/divers', diverRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/spots', spotRoutes);


// Serve static files (if needed for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running!' });
});

app.use(requestId);       // Associe un ID unique à chaque requête
app.use(httpLogger);      // Log chaque requête HTTP
app.use(errorLogger);     // Log les erreurs

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred.',
  });
});

export default app;