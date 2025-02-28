import { Component } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban',
  imports: [CommonModule,
    DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {
  columns = [
    { name: 'À faire', tasks: [{ title: 'Tâche 1', editing: false }], editing: false },
    { name: 'En cours', tasks: [{ title: 'Tâche 2', editing: false }], editing: false },
    { name: 'Terminé', tasks: [{ title: 'Tâche 3', editing: false }], editing: false }
  ];

  // Récupérer les IDs des colonnes pour le Drag & Drop
  getConnectedLists() {
    return this.columns.map((_, index) => `list-${index}`);
  }

  // Déplacer une tâche
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // Ajouter une tâche
  addTask(colIndex: number) {
    this.columns[colIndex].tasks.push({ title: 'Nouvelle tâche', editing: false });
  }

  // Supprimer une tâche
  deleteTask(colIndex: number, taskIndex: number) {
    this.columns[colIndex].tasks.splice(taskIndex, 1);
  }

  // Passer une colonne en mode édition
  startEditingColumn(index: number) {
    this.columns[index].editing = true;
  }

  // Sauvegarder le nouveau nom de la colonne
  finishEditingColumn(index: number, event: any) {
    this.columns[index].name = event.target.value;
    this.columns[index].editing = false;
  }

  // Passer une tâche en mode édition
  startEditingTask(colIndex: number, taskIndex: number) {
    this.columns[colIndex].tasks[taskIndex].editing = true;
  }

  // Sauvegarder la modification d'une tâche
  finishEditingTask(colIndex: number, taskIndex: number, event: any) {
    this.columns[colIndex].tasks[taskIndex].title = event.target.value;
    this.columns[colIndex].tasks[taskIndex].editing = false;
  }
}
