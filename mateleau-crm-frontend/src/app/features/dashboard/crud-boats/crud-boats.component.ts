import { Component, OnInit } from '@angular/core';
import { Boat } from '../../../models/Boat';
import { BoatService } from '../../../core/service/boat.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericFormDialogComponent } from '../../../shared/generic-form-dialog/generic-form-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { boatFields } from '../../../shared/form/form-config';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-crud-boats',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './crud-boats.component.html',
  styleUrl: './crud-boats.component.scss'
})
export class CrudBoatsComponent implements OnInit {
 boats: Boat[] = [];
  displayedColumns = ['name', 'numberMaxPlaces', 'revisionDate', 'actions'];

  constructor(
    private boatService: BoatService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBoats();
  }

  loadBoats() {
    this.boatService.getAll().subscribe((data) => {
      this.boats = data;
    });
  }

  openForm(boat?: Boat) {
    this.dialog.open(GenericFormDialogComponent, {
      width: '500px',
      data: {
        title: boat ? 'Modifier un bateau' : 'Créer un bateau',
        fields: boatFields,
        values: boat
      }
    }).afterClosed().subscribe((result) => {
      if (!result) return;

      const action = boat
        ? this.boatService.update(result)
        : this.boatService.create(result);

      action.subscribe(() => this.loadBoats());
    });
  }

  deleteBoat(id: string) {
    if (confirm('Supprimer ce bateau ?')) {
      this.boatService.delete(id).subscribe(() => this.loadBoats());
    }
  }
}
