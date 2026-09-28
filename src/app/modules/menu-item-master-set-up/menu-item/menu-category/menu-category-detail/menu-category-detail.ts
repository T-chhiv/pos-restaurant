import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ShareMaterialModule } from '../../../../../shareComponents/share-material/share-material-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItemCategoryService } from '../../../../../services/menu-items-services/menu-item-category-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-menu-category-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule,],
  templateUrl: './menu-category-detail.html',
  styleUrl: './menu-category-detail.css',
})
export class MenuCategoryDetail implements OnInit{
  id!: number;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private menuItemCategoryService: MenuItemCategoryService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private dialogRef: MatDialogRef<MenuCategoryDetail>
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
      status: [true, Validators.required],
      description: ['']
    })
  }

  private getFormDetail(): void{
    if(this.id){
      this.menuItemCategoryService.getById(this.id).subscribe(res => {
        const menuItemCategory = res;
        this.form.patchValue(menuItemCategory)
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
    this.menuItemCategoryService.create(this.form.value).subscribe(res => {
      this.closeDialog()
    })
  }

  private onUpdate(): void{
    this.menuItemCategoryService.update(this.id, this.form.value).subscribe(res => {
      this.closeDialog();
    })
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

}
