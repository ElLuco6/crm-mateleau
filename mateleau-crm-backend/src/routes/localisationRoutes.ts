import express from 'express';
import * as LocalisationController from '../controllers/LocalisationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        LocalisationController.createLocalisation(req, res);
    });
});
router.get('/', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        LocalisationController.getAllLocalisations(req, res);
    });
});
router.delete('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        LocalisationController.deleteLocalisation(req, res);
    });
});
router.get('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        LocalisationController.getLocalisationById(req, res);
    });
});
router.put('/:id', (req: express.Request, res: express.Response) => {
    authenticateToken(req, res, () => {
        LocalisationController.updateLocalisation(req, res);
    });
});

export default router;
