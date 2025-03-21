import express, { Request, Response } from "express";
import {
  createUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  getCurrentUser,
} from "../controllers/UserControllers";
import {
  encryptPassword,
  checkEmailUnique,
} from "../middleware/userMiddleware";
import {
  authenticateToken,
  checkAdminRole,
} from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               divingLvl:
 *                 type: number
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", (req: Request, res: Response) => {
    checkEmailUnique(req, res, () => {
      encryptPassword(req, res, () => {
        createUser(req, res);
      });
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getAllUsers(req, res);
  });
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user details
 */
router.get("/me", (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getCurrentUser(req, res);
  });
});

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               divingLvl:
 *                 type: number
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 */
router.put("/me", (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    encryptPassword(req, res, () => {
      updateCurrentUser(req, res);
    });
  });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", (req: Request, res: Response) => {
  authenticateToken(req, res, () => {
    getOneUser(req, res);
  });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               divingLvl:
 *                 type: number
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put("/:id", (req: Request, res: Response) => {
  checkAdminRole(req, res, () => {
    encryptPassword(req, res, () => {
      updateUser(req, res);
    });
  });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", (req: Request, res: Response) => {
  checkAdminRole(req, res, () => {
    deleteUser(req, res);
  });
});

export default router;