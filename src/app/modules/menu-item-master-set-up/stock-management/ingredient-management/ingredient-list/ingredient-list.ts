import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Ingredient } from '../../../../../models/ingredient-model';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';
import { IngredientDetail } from '../ingredient-detail/ingredient-detail';

@Component({
  selector: 'app-ingredient-list',
  standalone: false,
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.css',
})
export class IngredientList implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  ingredients: Ingredient[] = [];

  displayedColumns: string[] = [
    'no',
    'img',
    'name',
    'description',
    'status',
    'actions'
  ];

  pageSize = 10;
  pageSizeOption: number[] = [10, 15, 20, 25, 30, 40, 50];
  dataSource = new MatTableDataSource<Ingredient>([]);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private ingredientService: IngredientService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIngredient();
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [''],
    });

    this.form.get('name')?.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  private filter(): void {
    const name = this.form.get('name')?.value ?? '';
    const searchName = String(name).toLowerCase().trim();

    const filteredData = this.ingredients.filter(ingredient => {
      const ingredientName = String(ingredient.name).toLowerCase().trim();
      return ingredientName.includes(searchName);
    });

    this.dataSource.data = filteredData;
    this.paginator?.firstPage();
  }

  private loadIngredient(): void {
    this.ingredientService.get().subscribe(res => {
      this.ingredients = [...res].reverse();
      this.dataSource.data = this.ingredients;
    });
  }

  remove(id: number): void {
    this.ingredientService.delete(id).subscribe(() => {
      this.loadIngredient();
    });
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(IngredientDetail, {
      width: '750px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadIngredient();
      }
    });
  }
}