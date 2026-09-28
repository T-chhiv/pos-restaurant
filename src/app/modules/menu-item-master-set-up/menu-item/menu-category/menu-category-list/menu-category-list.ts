import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItemCategory } from '../../../../../models/menu-item-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MenuItemCategoryService } from '../../../../../services/menu-items-services/menu-item-category-service';
import { MenuCategoryDetail } from '../menu-category-detail/menu-category-detail';

@Component({
  selector: 'app-menu-category-list',
  standalone: false,
  templateUrl: './menu-category-list.html',
  styleUrl: './menu-category-list.css',
})
export class MenuCategoryList implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  menuCategories: MenuItemCategory[] = [];

  displayedColumns: string[] = [
    'no',
    'name',
    'description',
    'status',
    'actions'
  ];

  pageSize = 10;
  pageSizeOption: number[] = [10, 15, 20, 25, 30, 40, 50];
  dataSource = new MatTableDataSource<MenuItemCategory>([]);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private menuItemCategoryService: MenuItemCategoryService,
  ){}

  ngOnInit(): void {
    this.initForm();
    this.loadMenuItemCategory();
  }

  private initForm(): void{
    this.form = this.fb.group({
      name: [''],
    })

    this.form.get('name')?.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  private filter(): void{
    const name = this.form.get('name')?.value ?? '';
    const searchName = String(name).toLowerCase().trim();

    const filterData = this.menuCategories.filter(menuItemCategory => {
      const menuItemCategoryName = String(menuItemCategory.name).toLowerCase().trim();
      return menuItemCategoryName.includes(searchName);
    })

    this.dataSource.data = filterData;
    this.paginator?.firstPage();
  }

  private loadMenuItemCategory(): void{
    this.menuItemCategoryService.get().subscribe(res => {
      this.menuCategories = [...res].reverse();
      this.dataSource.data = this.menuCategories;
    })
  }

  remove(id: number): void{
    this.menuItemCategoryService.delete(id).subscribe(res => {
      this.loadMenuItemCategory();
    })
  }

  openDialog(id?: number): void{
    const dialogRef = this.dialog.open(MenuCategoryDetail,{
      width: '750px',
      data: {id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuItemCategory();
      }
    });
  }

}
