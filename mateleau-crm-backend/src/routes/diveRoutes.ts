import express, { Request, Response } from 'express';
import { createDive, getAllDives, getDiveById, updateDive, deleteDive, getDiveDetail } from '../controllers/DiveControllers';
import { authenticateToken } from '../middleware/authMiddleware';
import asyncHandler from 'express-async-handler';
import { NotificationService } from '../services/NotificationService';

const router = express.Router();

/**
 * @swagger
 * /dives:
 *   get:
 *     summary: Returns the list of all the dives
 *     tags: [Dives]
 *     responses:
 *       200:
 *         description: The list of the dives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dive'
 */
router.get('/', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAllDives(req, res);
  });
});

/**
 * @swagger
 * /dives/{id}:
 *   get:
 *     summary: Get a dive by ID
 *     tags: [Dives]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dive ID
 *     responses:
 *       200:
 *         description: The dive description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dive'
 *       404:
 *         description: The dive was not found
 */
router.get('/:id', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getDiveById(req, res);
  });
});

// GET /api/dives/:id/detail
router.get('/:id/detail', (
  req: Request,
  res: Response
) => {
  authenticateToken(req, res, () => {
    getDiveDetail(req, res);
  });
});

router.post(
  '/:id/remind-divers',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const templateId = req.query.templateId ? Number(req.query.templateId) : 0;
    const result = await NotificationService.notifyDiveDivers(id, { templateId });
    res.json(result);
  })
);



/**
 * @swagger
 * /dives:
 *   post:
 *     summary: Create a new dive
 *     tags: [Dives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dive'
 *     responses:
 *       201:
 *         description: The dive was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dive'
 *       500:
 *         description: Some server error
 */
router.post('/', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    createDive(req, res);
  });
});

/**
 * @swagger
 * /dives/{id}:
 *   put:
 *     summary: Update a dive by ID
 *     tags: [Dives]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dive ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dive'
 *     responses:
 *       200:
 *         description: The dive was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dive'
 *       404:
 *         description: The dive was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    updateDive(req, res);
  });
});

/**
 * @swagger
 * /dives/{id}:
 *   delete:
 *     summary: Remove a dive by ID
 *     tags: [Dives]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dive ID
 *     responses:
 *       200:
 *         description: The dive was deleted
 *       404:
 *         description: The dive was not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    deleteDive(req, res);
  });
});

export default router;