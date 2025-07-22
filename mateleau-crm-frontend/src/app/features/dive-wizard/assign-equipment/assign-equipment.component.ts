import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../../models/Equipment';

@Component({
  selector: 'app-assign-equipment',
  imports: [],
  templateUrl: './assign-equipment.component.html',
  styleUrl: './assign-equipment.component.scss'
})
export class AssignEquipmentComponent implements OnInit{

  equipmentList:Equipment [] = []
  constructor() {}
  ngOnInit(): void {

  }

}
