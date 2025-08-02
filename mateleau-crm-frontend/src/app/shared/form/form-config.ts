 import { FormFieldConfig } from '../types/form-field-config';
 
export const userFields = (isEditMode: boolean = false): FormFieldConfig[] => [
  { key: 'name', label: 'Nom', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'password', label: 'Mot de passe', type: 'password', required: !isEditMode, hidden: isEditMode },
  { key: 'role', label: 'Rôle', type: 'select', required: true, options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Staff', value: 'staff' }
  ]},
  { key: 'divingLvl', label: 'Niveau de plongée', type: 'select', required: true, options:
    [0,1,2,3,4,5].map(lvl => ({ label: `Niveau ${lvl}`, value: lvl }))
  }
];
export const boatFields: FormFieldConfig[] = [
  { key: 'name', label: 'Nom du bateau', type: 'text', required: true },
  { key: 'numberMaxPlaces', label: 'Nombre de places', type: 'number', required: true },
  { key: 'revisionDate', label: 'Date de révision', type: 'date', required: true }
];

export const equipmentFields: FormFieldConfig[] = [
  { key: 'nature', label: 'Type de matériel', type: 'select', required: true, options: [
    { label: 'Combinaison', value: 'combinaison' },
    { label: 'Détendeur', value: 'detendeur' },
    { label: 'Bouteille', value: 'bouteille' },
    { label: 'Masque', value: 'masque' },
    { label: 'Tuba', value: 'tuba' },
    { label: 'Palme', value: 'palme' },
    { label: 'Ordinateur', value: 'ordinateur' },
    { label: 'Lampe', value: 'lampe' },
    { label: 'Vidéo', value: 'video' },
    { label: 'Ponny', value: 'ponny' }
  ]},
  { key: 'size', label: 'Taille (si applicable)', type: 'text' },
  { key: 'reference', label: 'Référence', type: 'text', required: true },
  { key: 'nextMaintenanceDate', label: 'Prochaine maintenance', type: 'date', required: true },
  { key: 'isRented', label: 'Loué ?', type: 'select', required: true, options: [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]}
];

export const diverFields: FormFieldConfig[] = [
  { key: 'firstName', label: 'Prénom', type: 'text', required: true },
  { key: 'lastName', label: 'Nom', type: 'text', required: true },
  { key: 'divingLvl', label: 'Niveau de plongée', type: 'select', required: true, options:
    [0, 1, 2, 3, 4, 5].map(lvl => ({ label: `Niveau ${lvl}`, value: lvl }))
  },
  { key: 'age', label: 'Âge', type: 'number', required: true },
  { key: 'phone', label: 'Téléphone', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'additionalInfo', label: 'Infos complémentaires', type: 'text' }
  // rentedEquipment est un champ complexe (tableau d'objets), donc on ne le met pas ici en standard
];
