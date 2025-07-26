import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Equipment } from '../../../models/Equipment';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../create-dive-group/create-dive-group.component';

@Component({
  selector: 'app-assign-equipment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-equipment.component.html',
  styleUrl: './assign-equipment.component.scss'
})
export class AssignEquipmentComponent implements  AfterViewInit{

  equipmentList:Equipment [] = []
  groupedEquipment: { [nature: string]: Equipment[] } = {};
  @Input() dataForm!: FormGroup;
  @Input() step3FormGroup!: FormGroup;
  teams:Team[]= [];
  

  constructor(private availabilityService: AvailibilityService,
    private wizardService: DiveWizardService,
    private fb: FormBuilder
  ) {}


  ngAfterViewInit(): void {
    this.wizardService.onPayloadReady().subscribe((payload) => {
      console.log('Payload in AssignEquipment:', payload);
      this.teams = payload.teams || [];
      const assignEquipment =  this.step3FormGroup.get('equipmentAssignments') as FormGroup;
      for (const team of this.teams) {
        if(team.moniteur) {
          assignEquipment.addControl(team.moniteur._id, this.fb.control([]));
        }
        for (const diver of team.members) {
          assignEquipment.addControl(diver._id, this.fb.control([]));
        }
      }
      
      console.log('Teams:', this.teams);
      this.fetchEquipment();
    });
    
    
  }

  fetchEquipment(){
  this.availabilityService.getAvailableEquipment( this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration).subscribe(equipment => {
      this.equipmentList = equipment;
      this.groupedEquipment = this.equipmentList.reduce((acc: { [nature: string]: Equipment[] }, eq: Equipment) => {
    if (!acc[eq.nature]) acc[eq.nature] = [];
    acc[eq.nature].push(eq);
    return acc;
  }, {} as { [nature: string]: Equipment[] });
    });

    
    console.log('Teams:', this.teams);
  }
   
}
