export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'date' | 'boolean';
  required?: boolean;
  options?: { label: string; value: any }[]; // pour les champs de type "select"
  hidden?: boolean; // pour masquer conditionnellement des champs (ex: mot de passe en édition)
}
