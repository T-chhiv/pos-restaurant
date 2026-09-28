import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ShareMaterialModule } from '../share-material/share-material-module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule],
  templateUrl: './delete-confirmation-dialog.html',
  styleUrl: './delete-confirmation-dialog.css',
})
export class DeleteConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
