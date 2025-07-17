import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { User } from '../../../models/User';
import { DiveWizardService } from '../dive-wizard.service';

@Component({
  selector: 'app-create-dive-group',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './create-dive-group.component.html',
  styleUrl: './create-dive-group.component.scss'
})
export class CreateDiveGroupComponent implements OnInit, AfterContentInit{

  moniteurs: User[] = [];
  constructor(private formBuilder: FormBuilder,
              private availabilityService: AvailibilityService , 
              private wizardService: DiveWizardService
            ) { }

  ngOnInit(): void {
   
  }
  ngAfterContentInit(): void {
    this.availabilityService.getAvailableUsers(this.wizardService.getPayload().date, this.wizardService.getPayload().duration).subscribe(moniteurs => {
      this.moniteurs = moniteurs;
      console.log('Moniteurs disponibles:', this.moniteurs);
    });
     console.log('Composant CreateDiveGroup initialisé avec les moniteurs:', this.moniteurs);
  }

}
