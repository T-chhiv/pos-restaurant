import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import {
    Unit,
    UnitCategory,
} from '../../../../models/unit-model';
import { UnitService } from '../../../../services/unit-category & unit services/unit-service';
import { UnitCategoryService } from '../../../../services/unit-category & unit services/unit-category-service';

@Component({
    selector: 'app-unit-detail',
    standalone: true,
    imports: [
        CommonModule,
        ShareMaterialModule,
        ReactiveFormsModule,
    ],
    templateUrl: './unit-detail.html',
    styleUrl: './unit-detail.css',
})
export class UnitDetail implements OnInit {
  id?: number;
  form!: FormGroup;
  unitCategories: UnitCategory[] = [];

  constructor(
      private fb: FormBuilder,
      private unitService: UnitService,
      private unitCategoryService: UnitCategoryService,
      @Inject(MAT_DIALOG_DATA)
      public data: { id?: number },
      private dialogRef: MatDialogRef<UnitDetail>
  ) {
      this.id = data?.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadUnitCategory();
    this.id && this.getFormDetail()
  }

  private initForm(): void {
      this.form = this.fb.group({
          name: ['', Validators.required],
          symbol: ['', Validators.required],
          unitCategoryId: ['', Validators.required],
          conversionRate: ['',
              [
                  Validators.required,
                  Validators.min(0),
              ],
          ],
          status: [true, Validators.required],
      });
  }

  private loadUnitCategory(): void {
    this.unitCategoryService.get().subscribe({
        next: (res) => {
            this.unitCategories = [...res].reverse();
        },
        error: (err) => {
            console.error('Failed to load unit categories:', err);
        },
    });
  }

  private getFormDetail(): void{
    if(this.id){
      this.unitService.getById(this.id).subscribe(res => {
        const position = res;
        this.form.patchValue(position)
      })
    }
  }

  onSubmit(): void{
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(): void {
      const data: Unit = this.form.value;

      this.unitService.create(data).subscribe({
          next: () => {
              this.closeDialog();
          },
          error: (err) => {
              console.error('Failed to create unit:', err);
          },
      });
  }

  private onUpdate(): void {
      if (!this.id) {
          return;
      }

      const data: Unit = this.form.value;

      this.unitService.update(this.id, data).subscribe({
          next: () => {
              this.closeDialog();
          },
          error: (err) => {
              console.error('Failed to update unit:', err);
          },
      });
  }

  closeDialog(): void {
      this.dialogRef.close(true);
  }
}
