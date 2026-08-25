import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../../../models/employee-model';
import { DepartmentService } from '../../../../services/employee-setup-services/department-service';
import { PositionService } from '../../../../services/employee-setup-services/position-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-position-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './position-detail.html',
  styleUrl: './position-detail.css',
})
export class PositionDetail implements OnInit{
  id!: number; 
  form!: FormGroup;
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private departmentServices: DepartmentService,
    private positionService: PositionService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<PositionDetail>
  ){
    this.id = data.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.getFormDetail();
    this.getDepartment();
  }

  private initForm(){
    this.form =this.fb.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      description: [''],
    })
  }

  private getFormDetail(): void{
    if(this.id){
      this.positionService.getById(this.id).subscribe(res => {
        const position = res;
        this.form.patchValue(position)
      })
    }
  }

  private getDepartment(){
    this.departmentServices.get().subscribe(res => {
      this.departments = res
    })
  }

  onSubmit(): void{
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(): void{
    this.positionService.create(this.form.value).subscribe(res => {
      this.closeDialog();
    })
  }

  private onUpdate(): void{
    this.positionService.update(this.id, this.form.value).subscribe(res => {
      this.closeDialog();
    })
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
