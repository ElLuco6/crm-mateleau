import { Diver } from './Diver';
import { User } from './User';
import { Equipment } from './Equipment';

export interface RentedEquipment {
    diverId: string; // ID du plongeur
    equipmentIds: string[]; // IDs des équipements loués
}

export class DivingGroup {
    _id: string; // ID du groupe
    guide: User; // Guide du groupe
    divers: Diver[]; // Liste des plongeurs
    rentedEquipment: RentedEquipment[]; // Matériel loué par plongeur
    groupSize: number; // Taille du groupe

    constructor(_id:string, guide: User, divers: Diver[], rentedEquipment: RentedEquipment[] = []) {
        this._id = _id;
        this.guide = guide;
        this.divers = divers;
        this.rentedEquipment = rentedEquipment;
        this.groupSize = this.calculateGroupSize();
    }

    private calculateGroupSize(): number {
        return this.divers.length + 1; // Guide + plongeurs
    }

    public isValidGroup(): boolean {
        if (this.groupSize > 5) {
            throw new Error('Group size cannot exceed 5 members (including the guide).');
        }

        const diverIds = new Set(this.divers.map(diver => diver._id));
        if (diverIds.size !== this.divers.length) {
            throw new Error('Divers must be unique within the group.');
        }

        return true;
    }

    public validateEquipment(equipments: Equipment[]): void {
        const rentedEquipmentSet = new Set<string>();

        for (const assignment of this.rentedEquipment) {
            for (const equipmentId of assignment.equipmentIds) {
                const equipment = equipments.find(eq => eq._id === equipmentId);
                if (!equipment) {
                    throw new Error(`Equipment with ID ${equipmentId} not found`);
                }
                if (rentedEquipmentSet.has(equipment.nature)) {
                    throw new Error(`Equipment of nature ${equipment.nature} is already rented by another diver in this group.`);
                }
                rentedEquipmentSet.add(equipment.nature);
            }
        }
    }
}
