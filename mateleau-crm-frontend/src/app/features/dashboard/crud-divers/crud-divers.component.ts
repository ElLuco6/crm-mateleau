import { Component, OnInit } from '@angular/core';
import { Diver } from '../../../models/Diver';
import { MatDialog } from '@angular/material/dialog';
import { DiverServiceService } from '../../../core/service/diver-service.service';
import { GenericFormDialogComponent } from '../../../shared/generic-form-dialog/generic-form-dialog.component';
import { diverFields } from '../../../shared/form/form-config';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-crud-divers',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './crud-divers.component.html',
  styleUrl: './crud-divers.component.scss'
})
export class CrudDiversComponent implements OnInit {
divers: Diver[] = [];
  displayedColumns = ['firstName', 'lastName', 'divingLvl', 'email', 'actions'];

  constructor(
    private diverService: DiverServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDivers();
  }

  loadDivers() {
    this.diverService.getAll().subscribe((data) => {
      this.divers = data;
    });
  }

  openForm(diver?: Diver) {
    const isEditMode = !!diver;

    this.dialog.open(GenericFormDialogComponent, {
      width: '500px',
      data: {
        title: isEditMode ? 'Modifier un plongeur' : 'Créer un plongeur',
        fields: diverFields,
        values: diver
      }
    }).afterClosed().subscribe((result) => {
      if (!result) return;

      const action = isEditMode
        ? this.diverService.update(result)
        : this.diverService.create(result);

      action.subscribe(() => this.loadDivers());
    });
  }

  deleteDiver(id: string) {
    if (confirm('Supprimer ce plongeur ?')) {
      this.diverService.delete(id).subscribe(() => this.loadDivers());
    }
  }
}
