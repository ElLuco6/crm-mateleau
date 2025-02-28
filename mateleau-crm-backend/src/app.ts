import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './swagger';

// Import routes
import userRoutes from './routes/userRoutes';
import diveRoutes from './routes/diveRoutes';
import authRoutes from './routes/authRoutes';
import boatRoutes from './routes/boatRoutes'; // Importer les routes de Boat
import divingGroupRoutes from './routes/divingGroupRoutes';
import diverRoutes from './routes/diverRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import e from 'express';

// Create an instance of Express
const app: Application = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({
  origin: ['http://localhost:4200' , 'http://localhost'],
  credentials: true // Si vous utilisez des cookies d'authentification
})); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/boats', boatRoutes); // Utiliser les routes de Boat
app.use('/api/dives', diveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/diving-groups', divingGroupRoutes);
app.use('/api/divers', diverRoutes);
app.use('/api/equipment', equipmentRoutes);

// Serve static files (if needed for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running!' });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred.',
  });
});

export default app;