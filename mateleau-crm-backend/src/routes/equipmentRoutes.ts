import express, { Request, Response } from 'express';
import {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment,
    createMultipleEquipment
} from '../controllers/EquipmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /equipment:
 *   get:
 *     summary: Returns the list of all the equipment
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: The list of the equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */
router.get('/', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        getAllEquipment(req, res);
    });
});

/**
 * @swagger
 * /equipment/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The equipment ID
 *     responses:
 *       200:
 *         description: The equipment description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: The equipment was not found
 */
router.get('/:id', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        getEquipmentById(req, res);
    });
});

/**
 * @swagger
 * /equipment:
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       201:
 *         description: The equipment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       500:
 *         description: Some server error
 */
router.post('/', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        createEquipment(req, res);
    });
});

/**
 * @swagger
 * /equipment/{id}:
 *   put:
 *     summary: Update equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The equipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       200:
 *         description: The equipment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: The equipment was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        updateEquipment(req, res);
    });
});

/**
 * @swagger
 * /equipment/{id}:
 *   delete:
 *     summary: Delete equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The equipment ID
 *     responses:
 *       200:
 *         description: The equipment was deleted
 *       404:
 *         description: The equipment was not found
 */
router.delete('/:id', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        deleteEquipment(req, res);
    });
});

/**
 * @swagger
 * /equipment/multiple:
 *   post:
 *     summary: Create multiple equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Equipment'
 *     responses:
 *       201:
 *         description: The equipment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 *       500:
 *         description: Some server error
 */
router.post('/multiple', (req: Request, res: Response) => {
    authenticateToken(req, res, async () => {
        createMultipleEquipment(req, res);
    });
});

export default router;