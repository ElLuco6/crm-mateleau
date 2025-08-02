import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from '../../models/Equipment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentServiceService {

  constructor(private http: HttpClient) { }

     getAll() {
        return this.http.get<Equipment[]>(`${environment.apiEquipment}`,{
          withCredentials: true
        });
      }
  
      create(equipment: Equipment) {
        return this.http.post<Equipment>(`${environment.apiEquipment}`, equipment, {
          withCredentials: true
        });
      }

      update(equipment: Equipment) {
        console.log(`Updating equipment with ID: ${equipment._id}`, equipment);

        return this.http.put<Equipment>(`${environment.apiEquipment}/${equipment._id}`, equipment, {
          withCredentials: true
        });
      }

      delete(equipmentId: string) {
        return this.http.delete(`${environment.apiEquipment}/${equipmentId}`, {
          withCredentials: true
        });
      }

}
