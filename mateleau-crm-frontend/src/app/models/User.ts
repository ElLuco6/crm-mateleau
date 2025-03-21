export interface User {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'manager' | 'staff';
    divingLvl: 0 | 1 | 2 | 3 | 4 | 5;
  }