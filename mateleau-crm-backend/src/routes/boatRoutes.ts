import express, { Request, Response } from 'express';
import { createBoat, getAllBoats, getBoatById, updateBoat, deleteBoat } from '../controllers/BoatController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { boatValidation, boatIdValidation } from '../validators/Boat.validator';

const router = express.Router();

/**
 * @swagger
 * /boats:
 *   get:
 *     summary: Returns the list of all the boats
 *     tags: [Boats]
 *     responses:
 *       200:
 *         description: The list of the boats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Boat'
 */
router.get('/', 
    (req: Request, res: Response) => {
        authenticateToken(req, res, () => {
            getAllBoats(req, res);
        });
    }
);

/**
 * @swagger
 * /boats/{id}:
 *   get:
 *     summary: Get a boat by ID
 *     tags: [Boats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The boat ID
 *     responses:
 *       200:
 *         description: The boat description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       404:
 *         description: The boat was not found
 */
router.get('/:id', 
    (req: Request, res: Response) => {
        authenticateToken(req, res, () => {
            validate(boatIdValidation)(req, res, () => {
                getBoatById(req, res);
            });
        });
    }
);

/**
 * @swagger
 * /boats:
 *   post:
 *     summary: Create a new boat
 *     tags: [Boats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Boat'
 *     responses:
 *       201:
 *         description: The boat was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       500:
 *         description: Some server error
 */
router.post('/', 
    (req: Request, res: Response) => {
        authenticateToken(req, res, () => {
            validate(boatValidation)(req, res, () => {
                createBoat(req, res);
            });
        });
    }
);

/**
 * @swagger
 * /boats/{id}:
 *   put:
 *     summary: Update a boat by ID
 *     tags: [Boats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The boat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Boat'
 *     responses:
 *       200:
 *         description: The boat was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       404:
 *         description: The boat was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', 
    (req: Request, res: Response) => {
        authenticateToken(req, res, () => {
            validate([...boatIdValidation, ...boatValidation])(req, res, () => {
                updateBoat(req, res);
            });
        });
    }
);

/**
 * @swagger
 * /boats/{id}:
 *   delete:
 *     summary: Remove a boat by ID
 *     tags: [Boats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The boat ID
 *     responses:
 *       200:
 *         description: The boat was deleted
 *       404:
 *         description: The boat was not found
 */
router.delete('/:id', 
    (req: Request, res: Response) => {
        authenticateToken(req, res, () => {
            validate(boatIdValidation)(req, res, () => {
                deleteBoat(req, res);
            });
        });
    }
);

export default router;