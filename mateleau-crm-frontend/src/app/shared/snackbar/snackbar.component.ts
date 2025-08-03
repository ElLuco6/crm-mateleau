import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  imports: [MatIcon,CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: 'success' | 'error' | 'info' }) {}

  get colorClass() {
    switch (this.data.type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'info': return 'bg-blue-600';
      default: return 'bg-gray-800';
    }
  }

  get icon() {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }
}
