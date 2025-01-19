import express, { Request, Response } from "express";
import {
  createDiver,
  getAllDivers,
  getDiverById,
  updateDiver,
  deleteDiver,
  createMultipleDivers
} from "../controllers/DiverController";

const router = express.Router();

/**
 * @swagger
 * /divers:
 *   post:
 *     summary: Create a new diver
 *     tags: [Divers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               divingLvl:
 *                 type: number
 *     responses:
 *       201:
 *         description: Diver created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", createDiver);

/**
 * @swagger
 * /divers/multiple:
 *   post:
 *     summary: Create multiple divers
 *     tags: [Divers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 divingLvl:
 *                   type: number
 *     responses:
 *       201:
 *         description: Divers created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/multiple', createMultipleDivers);

/**
 * @swagger
 * /divers:
 *   get:
 *     summary: Get all divers
 *     tags: [Divers]
 *     responses:
 *       200:
 *         description: List of divers
 */
router.get("/", getAllDivers);

/**
 * @swagger
 * /divers/{id}:
 *   get:
 *     summary: Get a diver by ID
 *     tags: [Divers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diver ID
 *     responses:
 *       200:
 *         description: Diver details
 *       404:
 *         description: Diver not found
 */
router.get("/:id", (req: Request, res: Response) => {
  getDiverById(req, res);
});

/**
 * @swagger
 * /divers/{id}:
 *   put:
 *     summary: Update a diver by ID
 *     tags: [Divers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               divingLvl:
 *                 type: number
 *     responses:
 *       200:
 *         description: Diver updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Diver not found
 */
router.put("/:id", (req: Request, res: Response) => {
  updateDiver(req, res);
});

/**
 * @swagger
 * /divers/{id}:
 *   delete:
 *     summary: Delete a diver by ID
 *     tags: [Divers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diver ID
 *     responses:
 *       200:
 *         description: Diver deleted successfully
 *       404:
 *         description: Diver not found
 */
router.delete("/:id", (req: Request, res: Response) => {
  deleteDiver(req, res);
});

export default router;