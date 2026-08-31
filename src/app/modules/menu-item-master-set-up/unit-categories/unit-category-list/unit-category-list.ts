import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnitCategory } from '../../../../models/unit-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from '../../../../models/employee-model';
import { UnitCategoryService } from '../../../../services/unit-category & unit services/unit-category-service';
import { MatDialog } from '@angular/material/dialog';
import { UnitCategoryDetail } from '../unit-category-detail/unit-category-detail';

@Component({
  selector: 'app-unit-category-list',
  standalone: false,
  templateUrl: './unit-category-list.html',
  styleUrl: './unit-category-list.css',
})
export class UnitCategoryList implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  unitCategories: UnitCategory[] = [];

  displayedColumns: string[] = [
    'no',
    'name',
    'description',
    'action'
  ];

  pageSize = 10;
  pageSizeOption: number[] = [ 10, 15, 20, 25, 30, 40, 50];
  dataSource = new MatTableDataSource<Department>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private unitCategorySeervice: UnitCategoryService
  ){}

  ngOnInit(): void {
    this.initForm();
    this.loadUnitCategory();
  }

  private initForm(){
    this.form = this.fb.group({
      name: ['']
    })

    this.form.valueChanges.subscribe(() => this.filter())
  }

  private loadUnitCategory(){
    this.unitCategorySeervice.get().subscribe(res => {
      const data = res.reverse();
      this.unitCategories = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    })
  }

  private filter(): void{
    const name = this.form.get('name')?.value ?? '';
    const searchName = name.trim().toLowerCase();

    const filteredItem = this.unitCategories.filter(unitCategory => {
      const departmentName = unitCategory.name?.toLowerCase() ?? '';

      return (departmentName.includes(searchName))
    })

    this.dataSource.data = filteredItem;
  }

  remove(id: number){
    this.unitCategorySeervice.delete(id).subscribe(res => {
      this.loadUnitCategory();
    })
  }

  openDialog(id?: number){
    this.dialog.open(UnitCategoryDetail, {
      width: '650px',
      data:{
        id
      }
    })
  }
}
