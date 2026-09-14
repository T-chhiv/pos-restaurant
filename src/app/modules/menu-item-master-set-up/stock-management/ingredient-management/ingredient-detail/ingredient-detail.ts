import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShareMaterialModule } from '../../../../../shareComponents/share-material/share-material-module';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';

@Component({
  selector: 'app-ingredient-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './ingredient-detail.html',
  styleUrl: './ingredient-detail.css',
})
export class IngredientDetail implements OnInit {
  form!: FormGroup;
  id!: number;
  currentIngredientPhotoLink: string = '';

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<IngredientDetail>,
  ) {
    this.id = data?.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.id && this.getFormDetail();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      photo: ['', Validators.required],
      description: [''],
      status: [true, Validators.required],
    });

    this.getPhotoFormValue();
  }

  private getPhotoFormValue(): void {
    this.form.get('photo')?.valueChanges.subscribe(res => {
      this.currentIngredientPhotoLink = res;
    });
  }

  private getFormDetail(): void {
    if (this.id) {
      this.ingredientService.getById(this.id).subscribe(res => {
        this.form.patchValue(res);
      });
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(): void {
    this.ingredientService.create(this.form.value).subscribe(res => {
      this.dialogRef.close(true);
    });
  }

  private onUpdate(): void {
    this.ingredientService.update(this.id, this.form.value).subscribe(res => {
      this.dialogRef.close(true);
    });
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
