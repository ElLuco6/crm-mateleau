

export class  Equipment {
    _id: string;
    nature: "combinaison" | "detendeur" | "bouteille" | "masque" | "tuba" | "palme" | "ordinateur" | "lampe" | "video" | "ponny";
    size?: string; // Taille optionnelle (par exemple, pour combinaisons ou palmes)
    reference: string; // Référence unique pour chaque type
    nextMaintenanceDate: Date; // Date du prochain entretien
    isRented: boolean; // Si le matériel est actuellement loué
    constructor(
      _id: string, 
      nature: "combinaison" | "detendeur" | "bouteille" | "masque" | "tuba" | "palme" | "ordinateur" | "lampe" | "video" | "ponny",
      reference: string,
      nextMaintenanceDate: Date,
      isRented: boolean,
      size: string = ""
    ) {
      this._id = _id;
      this.nature = nature;
      this.size = size;
      this.reference = reference;
      this.nextMaintenanceDate = nextMaintenanceDate;
      this.isRented = isRented;
    }
  }
  