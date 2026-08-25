import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from '../../../../services/employee-setup-services/department-service';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './department-detail.html',
  styleUrl: './department-detail.css',
})
export class DepartmentDetail implements OnInit{
  form!: FormGroup;
  id!: number;
  
  constructor(
    private fb: FormBuilder,
    private dialog:MatDialog,
    private departmentService : DepartmentService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<DepartmentDetail>
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
      this.departmentService.getById(this.id).subscribe(res => {
        const department = res;
        this.form.patchValue(department)
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
    this.departmentService.create(this.form.value).subscribe(res => {
      this.closeDialog()
    })
  }

  private onUpdate(): void{
    this.departmentService.update(this.id, this.form.value).subscribe(res => {
      this.closeDialog();
    })
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
