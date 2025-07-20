export class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
  divingLvl: 0 | 1 | 2 | 3 | 4 | 5;

  constructor(
    _id:string,
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'manager' | 'staff' = 'staff',
    divingLvl: 0 | 1 | 2 | 3 | 4 | 5 = 0
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.divingLvl = divingLvl;
  }
}