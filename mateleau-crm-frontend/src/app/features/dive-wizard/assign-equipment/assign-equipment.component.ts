import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Equipment } from '../../../models/Equipment';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../create-dive-group/create-dive-group.component';
import { Diver } from '../../../models/Diver';
import { User } from '../../../models/User';

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
 @Input() formGroup!: FormGroup;
  teams:Team[]= [];
  equipmentOwnership: { [equipmentId: string]: string } = {};
selectedUserId:any;

  constructor(private availabilityService: AvailibilityService,
    private wizardService: DiveWizardService,
    private fb: FormBuilder
  ) {
  }
get form(): FormGroup {
    return this.formGroup;
  }

  getAssignedEquipmentMap(): Record<string, string[]> {
  const assignmentGroup = this.formGroup?.get('equipmentAssignments') as FormGroup;
  return assignmentGroup?.value || {};
}


 /*  ngOnChanges(): void { */

   /*  this.wizardService.onPayloadReady().subscribe((payload) => {
      console.log('Payload in AssignEquipment:', payload);
      this.teams = payload.teams || [];
      const assignEquipment = this.step3FormGroup.get('equipmentAssignments') as FormGroup;
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
    }); */

    /*  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step3FormGroup'] && this.step3FormGroup?.get('equipmentAssignments')) {
      this.wizardService.onPayloadReady().subscribe((payload) => {
        this.teams = payload.teams || [];

        const assignEquipment = this.step3FormGroup.get('equipmentAssignments') as FormGroup;
        for (const team of this.teams) {
          if (team.moniteur) {
            assignEquipment.addControl(team.moniteur._id, this.fb.control([]));
          }
          for (const diver of team.members) {
            assignEquipment.addControl(diver._id, this.fb.control([]));
          }
        }

        this.fetchEquipment();
      });
    }
  } */
  
    ngAfterViewInit(): void {
  if (this.formGroup?.get('equipmentAssignments')) {
    this.wizardService.onPayloadReady().subscribe((payload) => {
      this.teams = payload.teams || [];

      const assignEquipment = this.formGroup.get('equipmentAssignments') as FormGroup;
      for (const team of this.teams) {
        if (team.moniteur) {
          assignEquipment.addControl(team.moniteur._id, this.fb.control([]));
        }
        for (const diver of team.members) {
          assignEquipment.addControl(diver._id, this.fb.control([]));
        }
      }

      console.log('Teams:', this.teams);
      this.fetchEquipment();
    });
  } else {
    // fallback au cas où ça n'est pas prêt immédiatement
    setTimeout(() => this.ngAfterViewInit(), 0);
  }
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

get equipmentAssignmentsForm(): FormGroup {
  return this.formGroup.get('equipmentAssignments') as FormGroup;
}

assignEquipmentTo(userId: string, equipment: Equipment) {
  const assignGroup = this.formGroup.get('equipmentAssignments') as FormGroup;
  const userControl = assignGroup.get(userId) as FormControl;
  const current: Equipment[] = userControl?.value || [];

  const alreadyAssigned = this.equipmentOwnership[equipment._id];

  if (alreadyAssigned && alreadyAssigned !== userId) return;

  const hasIt = current.find(eq => eq._id === equipment._id);
  if (hasIt) {
    userControl.setValue(current.filter(eq => eq._id !== equipment._id));
    delete this.equipmentOwnership[equipment._id];
  } else {
    userControl.setValue([...current, equipment]);
    this.equipmentOwnership[equipment._id] = userId;
  }
}


getAllUsers(): (Diver | User)[] {
  return this.teams.flatMap(team => {
    const users: (Diver | User)[] = [...team.members];
    if (team.moniteur) users.push(team.moniteur);
    return users;
  });
}

  getShortName(userId: string): string {
  const all = this.getAllUsers();
  const user = all.find(u => u._id === userId);

  if (!user) return '???';

  if ('firstName' in user && 'lastName' in user) {
    return `${user.firstName} ${user.lastName}`;
  } else if ('name' in user) {
    return user.name;
  }

  return '???';
}

getUserById(userId: string): Diver | User | undefined {
  return this.getAllUsers().find(u => u._id === userId);
}

assignEquipmentToSelected(equipmentId: string) {
  if (!this.selectedUserId) return;

  const control = this.equipmentAssignmentsForm.get(this.selectedUserId);
  if (control) {
    control.setValue([equipmentId]); // exclusif
  }
}
isAlreadyAssigned(equipmentId: string): boolean {
  return Object.values(this.equipmentAssignmentsForm.controls).some(ctrl => {
    const value = ctrl.value as string[];
    return value?.includes(equipmentId);
  });
}

getAssignedEquipment(userId: string): Equipment[] {
  const ids = this.equipmentAssignmentsForm.get(userId)?.value || [];
  return this.equipmentList.filter(eq => ids.includes(eq._id));
}
}
