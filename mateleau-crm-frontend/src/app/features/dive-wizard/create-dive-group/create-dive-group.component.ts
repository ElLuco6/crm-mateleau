import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class CreateDiveGroupComponent implements OnInit, AfterContentInit {
  moniteurs: User[] = [];
  divers: Diver[] = [];
  teams: Team[] = [{ moniteur: undefined, members: [] }]; // faire le model palanquée (diving group sans le matériel)
  selectedTeam: number = 0;
  initialDivers: Diver[] = [];
initialMoniteurs: User[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private availabilityService: AvailibilityService,
    private wizardService: DiveWizardService
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    //Get the available users (moniteurs) based on the date and duration from the wizard service
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

    console.log(
      'Composant CreateDiveGroup initialisé avec les moniteurs:',
      this.moniteurs
    );
  }

  addTeam() {
    this.teams.push({ moniteur: undefined, members: [] });
  }

  selectTeam(teamIndex: number) {
    this.selectedTeam = teamIndex;
    console.log('Équipe sélectionnée:', this.selectedTeam);
  }

  AddOnSelectedTeam(diver?: Diver, moniteurs?: User) {
    const palanquee: Team = this.teams[this.selectedTeam];
    if (!palanquee) return;

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
      this.divers = this.divers.filter(d => d._id !== diver._id);
    } else if (moniteurs) {
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
    this.moniteurs = this.moniteurs.filter(m => m._id !== moniteurs._id);
    }
  }

  removeFromSelectedTeam(diver?: Diver, moniteur?: User) {
    const palanquee: Team = this.teams[this.selectedTeam];
    if (!palanquee) return;

    if (diver) {
      palanquee.members = palanquee.members.filter(
        (member) => member._id !== diver._id
      );
      this.divers.push(diver);
    } else if (moniteur) {
      palanquee.moniteur = undefined;
      this.moniteurs.push(moniteur);
    }
  }
}
/**
 * Interface représentant une équipe de plongée sans le matériel c'est le stade intermédiaire.
 */
export interface Team {
  moniteur?: User;
  members: Diver[];
}
