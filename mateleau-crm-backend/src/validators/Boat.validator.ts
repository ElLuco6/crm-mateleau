import { body, param } from 'express-validator';

// Création ou mise à jour d'un bateau
export const boatValidation = [
  body('name')
    .isString().withMessage('Le nom doit être une chaîne de caractères')
    .isLength({ min: 1, max: 100 }).withMessage('Le nom doit contenir entre 1 et 100 caractères'),

  body('numberMaxPlaces')
    .isInt({ min: 1, max: 500 }).withMessage('Le nombre de places doit être un entier positif'),

  body('revisionDate')
    .isISO8601().withMessage('La date de révision doit être au format ISO8601'),
];

// Validation d'ID Mongo (GET, PUT, DELETE)
export const boatIdValidation = [
  param('id')
    .isMongoId().withMessage('ID invalide'),
];