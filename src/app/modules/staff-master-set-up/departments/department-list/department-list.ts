import { Component, OnInit, ViewChild } from '@angular/core';
import { Department } from '../../../../models/employee-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DepartmentService } from '../../../../services/employee-setup-services/department-service';
import { MatPaginator } from '@angular/material/paginator';
import { DepartmentDetail } from '../department-detail/department-detail';
import { DeleteConfirmationService } from '../../../../services/Delete-confirmation-service/delete-confirmation-service';

@Component({
  selector: 'app-department-list',
  standalone: false,
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
})
export class DepartmentList implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  departments: Department[] = [];

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
    private dialog: MatDialog,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private deleteConfirmationService: DeleteConfirmationService
  ){}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartment();
  }

  private initForm(){
    this.form = this.fb.group({
      name: ['']
    })

    this.form.valueChanges.subscribe(() => this.filter())
  }

  private loadDepartment(): void{
    this.departmentService.get().subscribe( res => {
      const data = res.reverse();
      this.departments = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    })
  }

  private filter(): void{
    const name = this.form.get('name')?.value ?? '';
    const searchName = name.trim().toLowerCase();

    const filteredItem = this.departments.filter(department => {
      const departmentName = department.name?.toLowerCase() ?? '';

      return (departmentName.includes(searchName))
    })

    this.dataSource.data = filteredItem;
  }

  remove(id: number): void {
    this.deleteConfirmationService.confirm({
      title: 'Delete Record',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.departmentService.delete(id).subscribe( res => {
        this.loadDepartment();
      })
    });
  }

  openDialog(id?: number){
    const dialogRef = this.dialog.open(DepartmentDetail, {
      width: '650px',
      data:{
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartment();
      }
    });
  }
}

