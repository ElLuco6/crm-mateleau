import express from 'express';
import * as SpotController from '../controllers/SpotController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        SpotController.createSpot(req, res);
    });
});
router.get('/', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        SpotController.getAllSpots(req, res);
    });
});
router.delete('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        SpotController.deleteSpot(req, res);
    });
});
router.get('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        SpotController.getSpotById(req, res);
    });
});
router.put('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        SpotController.updateSpot(req, res);
    });
});

export default router;
