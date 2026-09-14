import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { Unit, UnitCategory } from '../../../../models/unit-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UnitService } from '../../../../services/unit-category & unit services/unit-service';
import { MatPaginator } from '@angular/material/paginator';
import { UnitDetail } from '../unit-detail/unit-detail';
import { UnitCategoryService } from '../../../../services/unit-category & unit services/unit-category-service';

@Component({
  selector: 'app-unit-list',
  standalone: false,
  templateUrl: './unit-list.html',
  styleUrl: './unit-list.css',
})
export class UnitList implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;

  units: Unit[] = [];
  unitCategories: UnitCategory[] = [];

  displayedColumns: string[] = [
    'no',
    'name',
    'symbol',
    'unitCategory',
    'conversionRate',
    'status',
    'action'
  ];

  pageSize = 10;
  pageSizeOption: number[] = [10, 15, 20, 25, 30, 40, 50];

  dataSource = new MatTableDataSource<Unit>([]);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private unitService: UnitService,
    private unitCategoryService: UnitCategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategoryUnit();
    this.loadUnit();
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [''],
      unitCategoryId: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  private filter(): void {
    const name = this.form.get('name')?.value ?? '';
    const unitCategoryId = this.form.get('unitCategoryId')?.value;

    const searchName = String(name).trim().toLowerCase();

    const filteredUnits = this.units.filter(unit => {
      const unitName = unit.name?.toLowerCase() ?? '';

      const matchesName = unitName.includes(searchName);

      const matchesUnitCategory =
        !unitCategoryId ||
        unit.unitCategoryId === Number(unitCategoryId);

      return matchesName && matchesUnitCategory;
    });

    this.dataSource.data = filteredUnits;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  private loadUnit(): void {
    this.unitService.get().subscribe(res => {
      this.units = [...res].reverse();
      this.dataSource.data = this.units;
    });
  }

  private loadCategoryUnit(): void {
    this.unitCategoryService.get().subscribe(res => {
      this.unitCategories = [...res].reverse();
    });
  }

  getUnitCategoryNameById(id: number): string {
    const category = this.unitCategories.find(
      category => category.id === id
    );

    return category?.name ?? '';
  }

  remove(id: number): void {
    this.unitService.delete(id).subscribe(() => {
      this.loadUnit();
    });
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(UnitDetail, {
      width: '650px',
      data: {
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUnit();
      }
    });
  }
}