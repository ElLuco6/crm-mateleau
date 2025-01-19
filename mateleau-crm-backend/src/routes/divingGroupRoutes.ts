import express, { Request, Response } from "express";
import {
  createDivingGroup,
  getAllDivingGroups,
  getDivingGroupById,
  updateDivingGroup,
  deleteDivingGroup,
} from "../controllers/DivingGroupController";

const router = express.Router();

/**
 * @swagger
 * /diving-groups:
 *   post:
 *     summary: Create a new diving group
 *     tags: [Diving Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guide:
 *                 type: string
 *               divers:
 *                 type: array
 *                 items:
 *                   type: string
 *               groupSize:
 *                 type: number
 *     responses:
 *       201:
 *         description: Diving group created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", (req: Request, res: Response) => {
  createDivingGroup(req,res)
});

/**
 * @swagger
 * /diving-groups:
 *   get:
 *     summary: Get all diving groups
 *     tags: [Diving Groups]
 *     responses:
 *       200:
 *         description: List of diving groups
 */
router.get("/", getAllDivingGroups);

/**
 * @swagger
 * /diving-groups/{id}:
 *   get:
 *     summary: Get a diving group by ID
 *     tags: [Diving Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diving group ID
 *     responses:
 *       200:
 *         description: Diving group details
 *       404:
 *         description: Diving group not found
 */
router.get("/:id", (req: Request, res: Response) => {
  getDivingGroupById(req, res);
});

/**
 * @swagger
 * /diving-groups/{id}:
 *   put:
 *     summary: Update a diving group by ID
 *     tags: [Diving Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diving group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guide:
 *                 type: string
 *               divers:
 *                 type: array
 *                 items:
 *                   type: string
 *               groupSize:
 *                 type: number
 *     responses:
 *       200:
 *         description: Diving group updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Diving group not found
 */
router.put("/:id", (req: Request, res: Response) => {
  updateDivingGroup(req, res);
});

/**
 * @swagger
 * /diving-groups/{id}:
 *   delete:
 *     summary: Delete a diving group by ID
 *     tags: [Diving Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diving group ID
 *     responses:
 *       200:
 *         description: Diving group deleted successfully
 *       404:
 *         description: Diving group not found
 */
router.delete("/:id", (req: Request, res: Response) => {
  deleteDivingGroup(req, res);
});

export default router;