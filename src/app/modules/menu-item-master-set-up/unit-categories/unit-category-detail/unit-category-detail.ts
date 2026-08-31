import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnitCategoryService } from '../../../../services/unit-category & unit services/unit-category-service';

@Component({
  selector: 'app-unit-category-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './unit-category-detail.html',
  styleUrl: './unit-category-detail.css',
})
export class UnitCategoryDetail implements OnInit{
  form!: FormGroup;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private unitCategoryService: UnitCategoryService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<UnitCategoryDetail>
  ){
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initform();
    this.getFormDetail();
  }

  private initform(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    })
  }

  private getFormDetail(): void{
    if(this.id){
      this.unitCategoryService.getById(this.id).subscribe(res => {
        const unitCategory = res;
        this.form.patchValue(unitCategory)
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

  private onCreate(): void{
    this.unitCategoryService.create(this.form.value).subscribe(res => {
      this.closeDialog()
    })
  }

  private onUpdate(): void{
    this.unitCategoryService.update(this.id, this.form.value).subscribe(res => {
      this.closeDialog();
    })
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
