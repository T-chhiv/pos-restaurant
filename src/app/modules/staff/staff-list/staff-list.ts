import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { Department, Employee, Position } from '../../../models/employee-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee-services/employee-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StaffDetail } from '../staff-detail/staff-detail';
import { DepartmentService } from '../../../services/employee-setup-services/department-service';
import { PositionService } from '../../../services/employee-setup-services/position-service';

@Component({
  selector: 'app-staff-list',
  standalone: false,
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
})
export class StaffList implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  staffs: Employee[] = [];
  departments: Department[] = [];
  positions: Position[] = []

  displayedColumns: string[] = [
    'no',
    'img',
    'name',
    'phone',
    'dateOfBirth',
    'department',
    'position',
    'salary',
    'hireDate',
    'status',
    'action'
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [ 10, 15, 20, 25, 30, 40, 50]
  dataSource = new MatTableDataSource<Employee>();

  constructor(
    private dialog: MatDialog,
    private fb : FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.iniForm();
    this.loadPosition();
    this.loadDepartment();
    this.loadEmployee();
  }

  private iniForm(){
    this.form = this.fb.group({
      name: ['']
    })

    this.form.valueChanges.subscribe(() => this.filterStaff())
  }

  private loadEmployee(): void {
    this.employeeService.get().subscribe({
      next: (res) => {
        const data = [...res].reverse();
        this.staffs = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  private loadDepartment(): void{
    this.departmentService.get().subscribe(res => {
      this.departments = res
    })
  }

  private loadPosition(): void{
    this.positionService.get().subscribe(res => {
      this.positions = res
    })
  }

  private filterStaff(): void {
    const name = this.form.get('name')?.value ?? '';
    const searchName = name.trim().toLowerCase();

    const filteredStaffs = this.staffs.filter(staff => {
      const firstName = staff.firstName?.toLowerCase() ?? '';
      const lastName = staff.lastName?.toLowerCase() ?? '';
      const username = staff.username?.toLowerCase() ?? '';
      return (
        firstName.includes(searchName) ||
        lastName.includes(searchName) ||
        username.includes(searchName)
      );
    });

    this.dataSource.data = filteredStaffs;

    // Reset paginator to first page after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  getDepartmentNameById(id: number){
    if(!this.departments) return;
    const department = this.departments.find(item => item.id === id)
    return department?.name;
  }

  getPositionNameById(id: number){
    if(!this.positions) return;
    const position = this.positions.find(item => item.id === id);
    return position?.name;
  }


  remove(id: number){
    this.employeeService.delete(id).subscribe(res => {
      this.loadEmployee();
    })
  }

  openDialog (id?: number){
    this.dialog.open(StaffDetail, {
      width: '850px',
      data:{
        id
      }
    })
  }
}
