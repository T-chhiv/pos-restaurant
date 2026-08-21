import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Position, Role } from '../../../models/employee-model';
import { EmployeeService } from '../../../services/employee-services/employee-service';
import { RoleService } from '../../../services/employee-setup-services/role-service';
import { DepartmentService } from '../../../services/employee-setup-services/department-service';
import { PositionService } from '../../../services/employee-setup-services/position-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { CommonModule } from '@angular/common';
import { ResetPasswordDetail } from '../reset-password-detail/reset-password-detail';

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
  isVisible: boolean = false;
  currentStaffPhotoLink: string = ''

  roles: Role[] = [];
  departments: Department[] =[];
  positions: Position[] =[];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
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
      status:[false, Validators.required],
      photo:['', Validators.required],
      phone: ['', Validators.required],
      hireDate:['', Validators.required],
    })

    this.getPhotoFormValue();
  }

  private getPhotoFormValue():void{
    this.form.get('photo')?.valueChanges.subscribe(res => {
      this.currentStaffPhotoLink = res
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

  onSubmit(): void {
    // Mark every field as touched so validation errors appear
    this.form.markAllAsTouched();
    // Stop submission if any required field is empty/invalid
    if (this.form.invalid) {
      return;
    }

    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(): void {
    this.staffService.create(this.form.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      }
    });
  }

  private onUpdate(): void {
    this.staffService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      }
    });
  }

  checkPasswordVisible(){
    this.isVisible = !this.isVisible;
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  openResetPasswordDialog (){
    this.dialog.open(ResetPasswordDetail, {
      width: '750px',
      data:{
        id: this.id
      }
    })
  }
}
