import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee-services/employee-service';

@Component({
  selector: 'app-reset-password-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './reset-password-detail.html',
  styleUrl: './reset-password-detail.css',
})
export class ResetPasswordDetail implements OnInit{
  id!: number;
  form!: FormGroup; 
  isNewPasswordVisible : boolean = false;
  isConfirmPasswordVisible : boolean = false;

  constructor(
    private fb: FormBuilder,
    private staffService : EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<ResetPasswordDetail>,
  ){
    this.id = data?.id
  }
  
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\S.*$/)
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\S.*$/)
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  // Check for misMatch Password
  private passwordMatchValidator(control: AbstractControl ): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPasswordControl = control.get('confirmPassword');

    if (!newPassword || !confirmPasswordControl?.value) {
      return null;
    }

    if (newPassword !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        passwordMismatch: true
      });

      return { passwordMismatch: true };
    }
    // Remove only passwordMismatch, keep other errors
    if (confirmPasswordControl.hasError('passwordMismatch')) {
      const errors = { ...confirmPasswordControl.errors };
      delete errors['passwordMismatch'];

      confirmPasswordControl.setErrors(
        Object.keys(errors).length ? errors : null
      );
    }
    return null;
  }

  checkNewPasswordVisible(){
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  checkConfirmPasswordVisible(){
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  resetPassword(){
    this.form.markAllAsTouched();
    if(this.form.invalid) return;
    const newPassword = this.form.get('newPassword')?.value;
    this.staffService.getById(this.id).subscribe(res => {
      const updateStaff =  {...res , password: newPassword}

      this.staffService.update(this.id, updateStaff).subscribe(res => {
        this.dialogRef.close(true);
      })
    })
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

}
