import { Component, ViewChild } from '@angular/core';
import { EquipmentServiceService } from '../../../core/service/equipment-service.service';
import { Equipment } from '../../../models/Equipment';
import { MatDialog } from '@angular/material/dialog';
import { GenericFormDialogComponent } from '../../../shared/generic-form-dialog/generic-form-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { equipmentFields } from '../../../shared/form/form-config';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-crud-equipments',
  imports: [MatTableModule, MatIconModule, MatButtonModule, DatePipe,CommonModule],
  templateUrl: './crud-equipments.component.html',
  styleUrl: './crud-equipments.component.scss'
})
export class CrudEquipmentsComponent {
@ViewChild(MatSort) sort!: MatSort;
  equipments: Equipment[] = [];
  dataSource: MatTableDataSource<Equipment> = new MatTableDataSource();
  displayedColumns = ['reference', 'nature', 'size', 'nextMaintenanceDate', 'isRented', 'actions'];

  constructor(
    private equipmentService: EquipmentServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  loadEquipments() {
    this.equipmentService.getAll().subscribe((data) => {
      this.equipments = data.sort((a, b) => a.nature.localeCompare(b.nature));
      this.dataSource = new MatTableDataSource(this.equipments);
      this.dataSource.sort = this.sort;
    });
  }

  openForm(equipment?: Equipment) {
    this.dialog.open(GenericFormDialogComponent, {
      width: '500px',
      data: {
        title: equipment ? 'Modifier un matériel' : 'Créer un matériel',
        fields: equipmentFields,
        values: equipment
      }
    }).afterClosed().subscribe((result) => {
      if (!result) return;

      const action = equipment
        ? this.equipmentService.update(result)
        : this.equipmentService.create(result);

      action.subscribe(() => this.loadEquipments());
    });
  }

  deleteEquipment(id: string) {
    if (confirm('Supprimer ce matériel ?')) {
      this.equipmentService.delete(id).subscribe(() => this.loadEquipments());
    }
  }
}
