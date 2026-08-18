import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Position, Role } from '../../../models/employee-model';
import { EmployeeService } from '../../../services/employee-services/employee-service';
import { RoleService } from '../../../services/employee-setup-services/role-service';
import { DepartmentService } from '../../../services/employee-setup-services/department-service';
import { PositionService } from '../../../services/employee-setup-services/position-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports:[CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './staff-detail.html',
  styleUrl: './staff-detail.css',
})
export class StaffDetail implements OnInit{
  form!: FormGroup;
  id!: number;

  roles: Role[] = [];
  departments: Department[] =[];
  positions: Position[] =[];

  constructor(
    private fb: FormBuilder,
    private staffService : EmployeeService,
    private roleService : RoleService,
    private departmentService : DepartmentService,
    private positionService : PositionService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<StaffDetail>,
  ){
    this.id = data?.id
  }
  
  ngOnInit(): void {
    this.iniForm();
    this.id && this.getFormDetail();
    this.getRoles();
    this.getPositions();
    this.getDepartment();
  }

  private iniForm(){
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      roleId: ['', Validators.required],
      departmentId: ['', Validators.required],
      positionId: ['', Validators.required],
      salary: ['', Validators.required],
      status:['', Validators.required],
      photo:['', Validators.required],
      phone: [''],
      hireDate:[''],
    })
  }

  private getFormDetail(): void{
    if(this.id){
      this.staffService.getById(this.id).subscribe(res => {
        const staff = res;
        this.form.patchValue(staff);
      })
    }
  }

  private getRoles(): void{
    this.roleService.get().subscribe(res => {
      this.roles = res;
    })
  }

  private getPositions(): void{
    this.positionService.get().subscribe(res => {
      this.positions = res;
    })
  }

  private getDepartment(): void{
    this.departmentService.get().subscribe(res => {
      this.departments = res;
    })
  }

  onSubmit(){
    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(){
    this.form.markAllAsTouched();
    this.staffService.create(this.form.value).subscribe(res => {
      this.dialogRef.close();
    })
  }

  private onUpdate(){
    this.staffService.update(this.id, this.form.value).subscribe(res => {
      this.dialogRef.close();
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
