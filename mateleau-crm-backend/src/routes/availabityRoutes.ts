import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getAvailableBoats, getAvailableDivers, getAvailableDivingGroups, getAvailableEquipment} from '../controllers/AvailabilityController';

const router = express.Router();

/**
 * @swagger
 * /availability/boats:
 *   get:
 *     summary: Get available boats
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *         required: true
 *         description: The duration to check availability
 *     responses:
 *       200:
 *         description: List of available boats
 *       400:
 *         description: Date and duration are required
 *       500:
 *         description: Internal server error
 */
router.get('/boats', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAvailableBoats(req, res);
  });
});

/**
 * @swagger
 * /availability/divers:
 *   get:
 *     summary: Get available divers
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *         required: true
 *         description: The duration to check availability
 *     responses:
 *       200:
 *         description: List of available divers
 *       400:
 *         description: Date and duration are required
 *       500:
 *         description: Internal server error
 */
router.get('/divers', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAvailableDivers(req, res);
  });
});

/**
 * @swagger
 * /availability/divingGroups:
 *   get:
 *     summary: Get available diving groups
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *         required: true
 *         description: The duration to check availability
 *     responses:
 *       200:
 *         description: List of available diving groups
 *       400:
 *         description: Date and duration are required
 *       500:
 *         description: Internal server error
 */
router.get('/divingGroups', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAvailableDivingGroups(req, res);
  });
});

/**
 * @swagger
 * /availability/equipment:
 *   get:
 *     summary: Get available equipment
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *         required: true
 *         description: The duration to check availability
 *     responses:
 *       200:
 *         description: List of available equipment
 *       400:
 *         description: Date and duration are required
 *       500:
 *         description: Internal server error
 */
router.get('/equipment', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAvailableEquipment(req, res);
  });
});

export default router;