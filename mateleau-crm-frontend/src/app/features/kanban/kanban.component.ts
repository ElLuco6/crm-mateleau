import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/service/dashboard.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-kanban',
  imports: [CommonModule,
    DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit {
  columns: Column[] = [
  { key: 'todo', name: 'À faire', tasks: [], editing: false },
  { key: 'inProgress', name: 'En cours', tasks: [], editing: false },
  { key: 'done', name: 'Terminé', tasks: [], editing: false }
];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
      this.loadTasks();
  }

  loadTasks() {
  this.dashboardService.getTasks().subscribe((tasks) => {
    this.columns.forEach((col) => {
      col.tasks = tasks
        .filter((t: any) => t.status === col.key)
        .map((t: any) => ({ ...t, editing: false })); // 💡 on ajoute `editing`
    });
  });
}
  // Récupérer les IDs des colonnes pour le Drag & Drop
  getConnectedLists() {
    return this.columns.map((_, index) => `list-${index}`);
  }

  drop(event: CdkDragDrop<any[]>, colIndex: number) {
    const column = this.columns[colIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.dashboardService.updateTask(task._id, { status: column.key }).subscribe();
    }
  }

  addTask(colIndex: number) {
    const title = prompt('Nom de la tâche :');
    if (!title) return;

    const column = this.columns[colIndex];
    const newTask = { title, status: column.key };

    this.dashboardService.createTask(newTask).subscribe((createdTask) => {
      this.columns[colIndex].tasks.push({ ...createdTask, editing: false });
    });
  }

  deleteTask(colIndex: number, taskId: string, taskIndex: number) {
    if (!confirm('Supprimer cette tâche ?')) return;
    this.dashboardService.deleteTask(taskId).subscribe(() => {
      this.columns[colIndex].tasks.splice(taskIndex, 1);
    });
  }

  startEditingTask(task: any) {
    task.editing = true;
  }

  finishEditingTask(task: any, event: any) {
    const newTitle = event.target.value;
    task.editing = false;

    if (task.title !== newTitle && newTitle.trim()) {
      this.dashboardService.updateTask(task._id, { title: newTitle }).subscribe(() => {
        task.title = newTitle;
      });
    }
  }
}


export interface Column {
  key: 'todo' | 'inProgress' | 'done'; // doit matcher avec le back
  name: string;
  tasks: (Task & { editing: boolean })[]; // ajoute editing à chaque task
  editing: boolean;
}