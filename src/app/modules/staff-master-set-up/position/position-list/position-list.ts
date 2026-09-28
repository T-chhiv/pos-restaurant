import { Component, OnInit, ViewChild } from '@angular/core';
import { Department, Position } from '../../../../models/employee-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../../../services/employee-setup-services/department-service';
import { PositionService } from '../../../../services/employee-setup-services/position-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PositionDetail } from '../position-detail/position-detail';
import { DeleteConfirmationService } from '../../../../services/Delete-confirmation-service/delete-confirmation-service';

@Component({
  selector: 'app-position-list',
  standalone: false,
  templateUrl: './position-list.html',
  styleUrl: './position-list.css',
})
export class PositionList implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  positions : Position[] = [];
  departments: Department[] = [];

  displayedColumns: string[] = [
    'no',
    'name',
    'department',
    'description',
    'action'
  ]

  pageSize = 10;
  pageSizeOptions: number[] = [ 10, 15, 20, 25, 30, 40, 50]
  dataSource = new MatTableDataSource<Position>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private positionService : PositionService,
    private deleteConfirmationService: DeleteConfirmationService
  ){}

  ngOnInit(): void {
    this.initForm();
    this.getDepartment();
    this.getPositions();
  }

  private initForm(){
    this.form = this.fb.group({
      name: [''],
      departmentId: ['']
    })

    this.form.valueChanges.subscribe(() => this.filter())
  }

  private filter(): void {
      const name = this.form.get('name')?.value ?? '';
      const departmentId = this.form.get('departmentId')?.value;

      const searchName = name.trim().toLowerCase();
      const filteredPositions = this.positions.filter(position => {

        // Position name filter
        const positionName = position.name?.toLowerCase() ?? '';
        const matchesName =positionName.includes(searchName);

        // Department filter
        const matchesDepartment = !departmentId || position.departmentId === Number(departmentId);

        return matchesName && matchesDepartment;
      });
      this.dataSource.data = filteredPositions;

      if (this.paginator) {
        this.paginator.firstPage();
      }
    }

  private getPositions(): void{
    this.positionService.get().subscribe(res => {
        const data = [...res].reverse();
        this.positions = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
    })
  }

  private getDepartment(): void{
    this.departmentService.get().subscribe(res => {
      this.departments = res;
    })
  }

  getDepartmentNameById(id: number){
    if(!this.departments) return;
    const department = this.departments.find(item => item.id === id)
    return department?.name;
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

      this.positionService.delete(id).subscribe(res => {
        this.getPositions();
      })
    });
  }

  openDialog(id?: number){
    const dialogRef = this.dialog.open(PositionDetail, {
      width: '750px',
      data:{
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPositions();
      }
    });
  }
}
