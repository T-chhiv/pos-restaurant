import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Ingredient, Stock } from '../../../../../models/ingredient-model';
import { Unit } from '../../../../../models/unit-model';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';
import { StockServices } from '../../../../../services/menu-items-services/stock-services';
import { UnitService } from '../../../../../services/unit-category & unit services/unit-service';
import { StockDetail } from '../stock-detail/stock-detail';

@Component({
  selector: 'app-stock-list',
  standalone: false,
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})
export class StockList implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  stocks: Stock[] = [];
  units: Unit[] = [];
  ingredients: Ingredient[] = [];

  displayedColumns: string[] = [
    'no',
    'img',
    'ingredient',
    'quantity',
    'averageCostPerUnit',
    'totalCost',
    'maxStockLevel',
    'minStockLevel',
    'status',
    'lastUpdate',
    'action'
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [10, 15, 20, 25, 30, 40, 50];
  dataSource = new MatTableDataSource<Stock>([]);

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private stockService: StockServices,
    private unitService: UnitService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIngredient();
    this.loadUnit();
    this.loadStock();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private initForm(): void {
    this.form = this.fb.group({
      ingredientId: ['']
    });

    this.form.get('ingredientId')?.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  private filter(): void {
    const ingredientId = this.form.get('ingredientId')?.value ?? '';

    this.dataSource.data = this.stocks.filter(stock =>
      ingredientId === '' ||
      String(stock.ingredientId) === String(ingredientId)
    );

    this.paginator?.firstPage();
  }

  private loadIngredient(): void {
    this.ingredientService.get().subscribe({
      next: res => {
        this.ingredients = [...res].reverse();
        this.cdr.detectChanges();
      },
    });
  }

  private loadUnit(): void {
    this.unitService.get().subscribe({
      next: res => {
        this.units = [...res].reverse();
        this.cdr.detectChanges();
      },
    });
  }

  private loadStock(): void {
    this.stockService.get().subscribe({
      next: res => {
        this.stocks = [...res].reverse();
        this.filter();
        this.cdr.detectChanges();
      },
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

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'images/no-image.jpg';
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(StockDetail, {
      width: '750px',
      maxWidth: '95vw',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStock();
      }
    });
  }

  // remove(id: number): void {
  //   this.stockService.delete(id).subscribe({
  //     next: () => this.loadStock(),
  //     error: err => console.error('Failed to delete stock:', err)
  //   });
  // }
}
