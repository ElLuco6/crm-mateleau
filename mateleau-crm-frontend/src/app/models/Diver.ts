import { Equipment } from "./Equipment";

export class Diver{
    id: string;
    firstName: string;
    lastName: string;
    divingLvl: 0 | 1 | 2 | 3 | 4 | 5;
    age: number;
    phone: string;
    email: string;
    additionalInfo?: string;
    rentedEquipment:Equipment[]; // Références aux équipements loués

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        divingLvl: 0 | 1 | 2 | 3 | 4 | 5,
        age: number,
        phone: string,
        email: string,
        additionalInfo: string = '',
        rentedEquipment: Equipment[] = []
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.divingLvl = divingLvl;
        this.age = age;
        this.phone = phone;
        this.email = email;
        this.additionalInfo = additionalInfo;
        this.rentedEquipment = rentedEquipment;
    }
}