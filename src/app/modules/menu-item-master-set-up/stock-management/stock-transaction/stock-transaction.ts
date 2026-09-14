import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { Ingredient, StockTransactionModel } from '../../../../models/ingredient-model';
import { Unit } from '../../../../models/unit-model';
import { StockTransactionService } from '../../../../services/menu-items-services/stock-transaction-service';
import { IngredientService } from '../../../../services/menu-items-services/ingredient-service';
import { UnitService } from '../../../../services/unit-category & unit services/unit-service';

@Component({
  selector: 'app-stock-transaction',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule, ReactiveFormsModule],
  templateUrl: './stock-transaction.html',
  styleUrl: './stock-transaction.css',
})
export class StockTransaction implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  stockTransactions: StockTransactionModel[] = [];
  ingredients: Ingredient[] = [];
  units: Unit[] = [];

  displayedColumns = [
    'no',
    'date',
    'img',
    'ingredient',
    'cost',
    'type',
    'note',
    'reference'
  ];

  pageSize = 10;
  pageSizeOptions = [10, 15, 20, 25, 30, 40, 50];
  dataSource = new MatTableDataSource<StockTransactionModel>([]);

  constructor(
    private fb: FormBuilder,
    private stockTransactionService: StockTransactionService,
    private ingredientService: IngredientService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIngredient();
    this.loadUnit();
    this.loadStockTransaction();

    this.form.get('date')?.valueChanges.subscribe(date => {
      this.filterByDate(date);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private initForm(): void {
    this.form = this.fb.group({
      date: ['']
    });
  }

  private loadStockTransaction(): void {
    this.stockTransactionService.get().subscribe(res => {
      this.stockTransactions = [...res].reverse();
      this.dataSource.data = this.stockTransactions;
      this.dataSource.paginator = this.paginator;
    });
  }

  private loadIngredient(): void {
    this.ingredientService.get().subscribe(res => {
      this.ingredients = [...res].reverse();
    });
  }

  private loadUnit(): void {
    this.unitService.get().subscribe(res => {
      this.units = [...res].reverse();
    });
  }

  refresh(): void {
    this.form.patchValue({
      date: ''
    });
  }

  getIngredientNameById(id: number): string {
    return this.ingredients.find(i => i.id === id)?.name ?? '';
  }

  getIngredientImageById(id: number): string {
    return this.ingredients.find(i => i.id === id)?.photo ?? '';
  }

  getUnitNameById(id: number): string {
    return this.units.find(u => u.id === id)?.symbol ?? '';
  }

  private filterByDate(date: Date | null): void {
    if (!date) {
      this.dataSource.data = this.stockTransactions;
    } else {
      const selectedDate = this.formatDate(date);

      this.dataSource.data = this.stockTransactions.filter(
        transaction => transaction.date === selectedDate
      );
    }

    this.paginator?.firstPage();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'images/no-image.jpg';
  }
}