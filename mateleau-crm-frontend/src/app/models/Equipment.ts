

export class  Equipment {
    _id: string;
    nature: "combinaison" | "detendeur" | "bouteille" | "masque" | "tuba" | "palme" | "ordinateur" | "lampe" | "video" | "ponny";
    size?: string; // Taille optionnelle (par exemple, pour combinaisons ou palmes)
    reference: string; // Référence unique pour chaque type
    nextMaintenanceDate: Date; // Date du prochain entretien
   
    constructor(
      _id: string, 
      nature: "combinaison" | "detendeur" | "bouteille" | "masque" | "tuba" | "palme" | "ordinateur" | "lampe" | "video" | "ponny",
      reference: string,
      nextMaintenanceDate: Date,
      size: string = ""
    ) {
      this._id = _id;
      this.nature = nature;
      this.size = size;
      this.reference = reference;
      this.nextMaintenanceDate = nextMaintenanceDate;
      
    }
  }
  