export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
  divingLvl: 0 | 1 | 2 | 3 | 4 | 5;

  constructor(
    id:string,
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'manager' | 'staff' = 'staff',
    divingLvl: 0 | 1 | 2 | 3 | 4 | 5 = 0
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.divingLvl = divingLvl;
  }
}