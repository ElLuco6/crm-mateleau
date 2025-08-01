import { AfterContentInit, AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { User } from '../../../models/User';
import { DiveWizardService } from '../dive-wizard.service';
import { Diver } from '../../../models/Diver';
import { DivingGroup } from '../../../models/DivingGroup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-dive-group',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-dive-group.component.html',
  styleUrl: './create-dive-group.component.scss',
})
export class CreateDiveGroupComponent implements AfterViewInit, OnChanges  {
  moniteurs: User[] = [];
  divers: Diver[] = [];
  teams: Team[] = [{ moniteur: undefined, members: [] }]; // faire le model palanquée (diving group sans le matériel)
  selectedTeam: number = 0;
  initialDivers: Diver[] = [];
  initialMoniteurs: User[] = [];
  selectedDriver: User | null = null;
  isDriverSelectionMode: boolean = false;
  selectingDriver = false;
  @Input() dataForm1!: FormGroup;
  @Input() formGroup!: FormGroup;


  boatLimit: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private availabilityService: AvailibilityService,
    private wizardService: DiveWizardService
  ) {}



  ngAfterViewInit(): void {
    //Get the available users (moniteurs) based on the date and duration from the wizard service

    this.wizardService.onPayloadReady().subscribe((payload) => {
      console.log('payload create group',payload);
      if (!payload) return;

      this.boatLimit = payload.formValue1.boat.numberMaxPlaces || 0;

      //  payload.formValue.
       if (this.dataForm1?.get('boat')?.value) {
      const boat = this.dataForm1.get('boat')!.value;
      console.log('Boat selected:', boat);
      
      this.boatLimit = boat.numberMaxPlaces || 0;
      console.log('✅ Boat limit:', this.boatLimit);
     }

      this.availabilityService
      .getAvailableUsers(
        this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration
      )
      .subscribe((moniteurs) => {
        this.moniteurs = moniteurs;
        console.log('Moniteurs disponibles:', this.moniteurs);
        this.initialMoniteurs = [...this.moniteurs];
      });

    this.availabilityService
      .getAvailableDivers(
        this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration
      )
      .subscribe((divers) => {
        this.divers = divers;
        console.log('Divers disponibles:', this.divers);
        this.initialDivers = [...this.divers];
      });
    
    })
  
   /*  this.availabilityService
      .getAvailableUsers(
        this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration
      )
      .subscribe((moniteurs) => {
        this.moniteurs = moniteurs;
        console.log('Moniteurs disponibles:', this.moniteurs);
        this.initialMoniteurs = [...this.moniteurs];
      });

    this.availabilityService
      .getAvailableDivers(
        this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration
      )
      .subscribe((divers) => {
        this.divers = divers;
        console.log('Divers disponibles:', this.divers);
        this.initialDivers = [...this.divers];
      });

    console.log(
      'Composant CreateDiveGroup initialisé avec les moniteurs:',
      this.moniteurs
    );

    console.log(this.dataForm1); */


    const boat = this.dataForm1.get('boat')?.value;
    if (boat) {
      this.boatLimit = boat.numberMaxPlaces || 0;
      
      console.log('Boat limit:', this.boatLimit, 'Boat:', boat);
    }
  
    this.formGroup.get('teams')?.setValue(this.teams);
    this.formGroup.addControl('driver', this.formBuilder.control(null));

  }

  ngOnChanges() {
    if (this.dataForm1?.get('boat')?.value) {
      const boat = this.dataForm1.get('boat')!.value;
      this.boatLimit = boat.numberMaxPlaces || 0;
      console.log('✅ Boat limit:', this.boatLimit);
      this.fetchDiversAndMoniteurs();
    }
  }

  removeTeam(index: number) {
  const team = this.teams[index];
  if (!team) return;

  // Remet les membres dans la liste des plongeurs
  team.members.forEach(diver => {
    if (!this.divers.some(d => d._id === diver._id)) {
      this.divers.push(diver);
    }
  });

  // Remet le moniteur s’il n’est pas le conducteur
  if (team.moniteur && team.moniteur._id !== this.selectedDriver?._id) {
    if (!this.moniteurs.some(m => m._id === team.moniteur!._id)) {
      this.moniteurs.push(team.moniteur);
    }
  }

  // Supprime l'équipe
  this.teams.splice(index, 1);

  // Si c'était l'équipe sélectionnée, on reset
  if (this.selectedTeam === index) {
    this.selectedTeam = 0;
  } else if (this.selectedTeam > index) {
    this.selectedTeam -= 1; // décale les index
  }

  this.formGroup.get('groups')?.setValue(this.teams);
}


  getAvailableDrivers(): User[] {
  const assignedMoniteurIds = this.teams
    .map(team => team.moniteur?._id)
    .filter(id => !!id);

  return this.initialMoniteurs.filter(moniteur =>
    moniteur._id !== this.selectedDriver?._id &&
    !assignedMoniteurIds.includes(moniteur._id)
  );
}

  onSelectDriver(driver: User) {
  // Si un driver était déjà sélectionné, on le remet dans la liste
  if (this.selectedDriver) {
    this.moniteurs.push(this.selectedDriver);
  }

  // Retirer ce driver des moniteurs dispo
  this.moniteurs = this.moniteurs.filter(m => m._id !== driver._id);
  this.selectedDriver = driver;

  // Stocker dans le formGroup (accessible depuis le parent)
  this.formGroup.get('driver')?.setValue(driver._id);

  // Nettoyage si le conducteur était déjà dans une équipe
  this.teams = this.teams.map(team => ({
    ...team,
    moniteur: team.moniteur?._id === driver._id ? undefined : team.moniteur,
  }));
}

selectDriver(moniteur: User) {
  if (this.selectingDriver) {
    this.selectedDriver = moniteur;
    this.selectingDriver = false;

    // Supprimer le driver des moniteurs si jamais il est listé
    this.moniteurs = this.moniteurs.filter(m => m._id !== moniteur._id);

    // Supprimer ce moniteur des équipes s’il y était
    this.teams.forEach(team => {
      if (team.moniteur && team.moniteur._id === moniteur._id) {
        team.moniteur = undefined;
      }
    });

    this.formGroup.get('driver')?.setValue(moniteur);
  }
}


  fetchDiversAndMoniteurs() {
    console.log('Data Form 1:', this.dataForm1);

   const payload = this.wizardService.getPayload();

    this.availabilityService
      .getAvailableUsers(payload.date, payload.duration)
      .subscribe((moniteurs) => {
        this.initialMoniteurs = moniteurs;
        this.moniteurs = this.selectedDriver
          ? moniteurs.filter((m) => m._id !== this.selectedDriver!._id)
          : moniteurs;
      });

    this.availabilityService
      .getAvailableDivers(payload.date, payload.duration)
      .subscribe((divers) => {
        this.divers = divers;
        this.initialDivers = [...divers];
      });
  }

setDriver(moniteur: User) {
  this.selectedDriver = moniteur;

  // Le retirer des équipes s’il y était
  this.teams.forEach(team => {
    if (team.moniteur && team.moniteur._id === moniteur._id) {
      team.moniteur = undefined;
    }
  });

  // Retirer le conducteur de la liste des moniteurs assignables
  this.moniteurs = this.initialMoniteurs.filter(m => m._id !== moniteur._id);

  this.formGroup.get('driver')?.setValue(moniteur);
}

activateDriverSelection() {
  this.isDriverSelectionMode = true;
}


  addTeam() {
    this.teams.push({ moniteur: undefined, members: [] });
    this.formGroup.get('groups')?.setValue(this.teams);
  }

  selectTeam(teamIndex: number) {
    this.selectedTeam = teamIndex;
    console.log('Équipe sélectionnée:', this.selectedTeam);
  }

  AddOnSelectedTeam(diver?: Diver, moniteurs?: User) {
    if (this.isDriverSelectionMode || !moniteurs && !diver) return;

    const palanquee: Team = this.teams[this.selectedTeam];
    if (!palanquee) return;

    const currentTotal = this.getCurrentTeamSize();
    if (currentTotal >= this.boatLimit) {
      console.warn('Capacité maximale du bateau atteinte.');
      return;
    }

    if (diver) {
      if (palanquee.members.length >= 3) {
        console.warn('Limite de 3 plongeurs atteinte.');
        return;
      }
      if (palanquee.members.some((member) => member._id === diver._id)) {
        console.warn('Un plongeur est déjà sélectionné pour cette palanquée.');
        return;
      }
      palanquee.members.push(diver);
      this.divers = this.divers.filter((d) => d._id !== diver._id);
    } else if (moniteurs) {
     if (moniteurs._id === this.selectedDriver?._id) return;

      if (palanquee.moniteur?._id === moniteurs._id) {
        console.warn('Ce moniteur est déjà dans l’équipe.');
        return;
      }

      if (palanquee.moniteur) {
        this.moniteurs.push(palanquee.moniteur);
      }
      // Remplace par le nouveau
      palanquee.moniteur = moniteurs;

      // Supprime de la liste des moniteurs dispo
      this.moniteurs = this.moniteurs.filter((m) => m._id !== moniteurs._id);
    }
    this.formGroup.get('groups')?.setValue(this.teams);
  }

 removeFromSelectedTeam(diver?: Diver, moniteur?: User, teamIndex?: number) {
  const palanquee: Team = typeof teamIndex === 'number' ? this.teams[teamIndex] : this.teams[this.selectedTeam];
  if (!palanquee) return;

  if (diver) {
    palanquee.members = palanquee.members.filter(
      (member) => member._id !== diver._id
    );
    this.divers.push(diver);
  }

  if (moniteur) {
    if (moniteur._id !== this.selectedDriver?._id) {
      palanquee.moniteur = undefined;
      // éviter les doublons dans la liste
      if (!this.moniteurs.some(m => m._id === moniteur._id)) {
        this.moniteurs.push(moniteur);
      }
    }
  }
}

  getCurrentTeamSize(): number {
  let count = this.selectedDriver ? 1 : 0;
  for (const team of this.teams) {
    count += team.members.length;
    if (team.moniteur) count += 1;
  }
  return count;
}

  
}
/**
 * Interface représentant une équipe de plongée sans le matériel c'est le stade intermédiaire.
 */
export interface Team {
  moniteur?: User;
  members: Diver[];
}
