import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import {
  ConfirmationDialogData,
  DeleteConfirmationDialog
} from '../../shareComponents/delete-confirmation-dialog/delete-confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class DeleteConfirmationService {

  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data
    });

    return dialogRef.afterClosed().pipe(
      map(result => !!result)
    );
  }
}