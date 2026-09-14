import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import {
  combineLatest,
  map,
  merge,
  Observable,
  shareReplay,
  startWith
} from 'rxjs';

import { ShareMaterialModule } from '../../../../../shareComponents/share-material/share-material-module';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';
import { UnitService } from '../../../../../services/unit-category & unit services/unit-service';
import { StockServices } from '../../../../../services/menu-items-services/stock-services';

import { Ingredient, Stock, StockTransactionModel } from '../../../../../models/ingredient-model';
import { Unit } from '../../../../../models/unit-model';
import { StockTransactionService } from '../../../../../services/menu-items-services/stock-transaction-service';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareMaterialModule
  ],
  templateUrl: './stock-detail.html',
  styleUrl: './stock-detail.css'
})
export class StockDetail implements OnInit {
  form!: FormGroup;
  id!: number;

  ingredientSearchControl = new FormControl('', {
    nonNullable: true
  });

  // Reactive data sources — the template consumes these via the
  // `async` pipe, so Angular's own CD scheduling handles timing
  // correctly and NG0100 can't happen regardless of response speed.
  ingredients$!: Observable<Ingredient[]>;
  units$!: Observable<Unit[]>;
  filteredIngredients$!: Observable<Ingredient[]>;
  selectedIngredient$!: Observable<Ingredient | null>;

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private unitService: UnitService,
    private stockService: StockServices,
    private sotckTransactionService: StockTransactionService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number },

    private dialogRef: MatDialogRef<StockDetail>
  ) {
    this.id = data?.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.setupCostCalculation();
    this.setupDataStreams();
    this.loadStockIfEditing();
  }

  private initForm(): void {
    this.form = this.fb.group({
      ingredientId: ['', Validators.required],
      quantity: ['', Validators.required],
      unitId: ['', Validators.required],
      totalCost: ['', Validators.required],
      averageCostPerUnit: ['', Validators.required],
      status: [false, Validators.required],
      lastUpdated: ['', Validators.required],
      minStockLevel: [''],
      maxStockLevel: ['']
    });
  }

  private getToday(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Calculate only when creating
  private setupCostCalculation(): void {
    if (this.id) return;

    merge(
      this.form.get('quantity')!.valueChanges,
      this.form.get('totalCost')!.valueChanges
    ).subscribe(() => {
      this.calculateAverageCostPerUnit();
    });
  }

  private calculateAverageCostPerUnit(): void {
    const quantity = Number(this.form.get('quantity')?.value) || 0;
    const totalCost = Number(this.form.get('totalCost')?.value) || 0;
    const averageCost = quantity > 0 ? totalCost / quantity : 0;

    this.form.patchValue(
      { averageCostPerUnit: Number(averageCost.toFixed(2)) },
      { emitEvent: false }
    );
  }

  private setupDataStreams(): void {
    this.ingredients$ = this.ingredientService.get().pipe(
      map(list => list.filter(item => item.status)),
      shareReplay(1)
    );

    this.units$ = this.unitService.get().pipe(shareReplay(1));

    this.filteredIngredients$ = combineLatest([
      this.ingredients$,
      this.ingredientSearchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([ingredients, search]) => {
        // MatAutocomplete writes the selected option's raw value (an
        // Ingredient object) back into this control on selection, so
        // `search` isn't guaranteed to be a string — guard it.
        const term =
          typeof search === 'string' ? search.toLowerCase().trim() : '';

        return term
          ? ingredients.filter(item =>
              item.name.toLowerCase().includes(term)
            )
          : ingredients;
      })
    );

    this.selectedIngredient$ = combineLatest([
      this.ingredients$,
      this.form.get('ingredientId')!.valueChanges.pipe(
        startWith(this.form.get('ingredientId')!.value)
      )
    ]).pipe(
      map(([ingredients, ingredientId]) =>
        ingredientId
          ? ingredients.find(item => item.id === Number(ingredientId)) ?? null
          : null
      )
    );
  }

  private loadStockIfEditing(): void {
    if (!this.id) return;

    this.stockService.getById(this.id).subscribe(res => {
      this.form.patchValue(res);
    });
  }

  // Controls what MatAutocomplete renders in the native input. Without
  // this, selecting an option makes Material try to stringify the raw
  // Ingredient object into the input's value.
  displayFn = (): string => '';

  selectIngredient(ingredient: Ingredient): void {
    this.form.patchValue({ ingredientId: ingredient.id });

    // emitEvent: false avoids re-triggering filteredIngredients$ with
    // a value we're about to discard anyway.
    this.ingredientSearchControl.setValue('', { emitEvent: false });
  }

  removeIngredient(): void {
    this.form.patchValue({ ingredientId: '' });

    this.ingredientSearchControl.setValue('', { emitEvent: false });
  }

  onSubmit(): void {
    this.form.patchValue({lastUpdated: this.getToday()});
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.id ? this.onUpdate() : this.onCreate();
  }

  private getPayload(): any {
    return {
      ingredientId: Number(this.form.value.ingredientId),
      quantity: Number(this.form.value.quantity),
      unitId: Number(this.form.value.unitId),
      totalCost: Number(this.form.value.totalCost),
      status: Boolean(this.form.value.status),
      minStockLevel: Number(this.form.value.minStockLevel) || 0,
      maxStockLevel: Number(this.form.value.maxStockLevel) || 0
    };
  }

  private onCreate(): void {
    const payload = this.getPayload();

    this.stockService.get().subscribe(stocks => {
      const existingStock = stocks.find(
        stock => Number(stock.ingredientId) === payload.ingredientId
      );

      existingStock
        ? this.mergeExistingStock(existingStock, payload)
        : this.createNewStock(payload);
    });
  }

  private mergeExistingStock(existingStock: Stock, payload: Stock){
    if (Number(existingStock.unitId) !== payload.unitId) {
      alert('The selected unit must match the existing stock unit.');
      return;
    }

    const quantity = Number(existingStock.quantity) + payload.quantity;
    const totalCost = Number(existingStock.totalCost) + payload.totalCost;
    const stock: Stock ={
       ingredientId: payload.ingredientId,
      quantity,
      unitId: payload.unitId,
      averageCostPerUnit: this.getCostPerUnit(quantity, totalCost),
      totalCost: Number(totalCost.toFixed(2)),
      status: payload.status,
      minStockLevel: payload.minStockLevel,
      maxStockLevel: payload.maxStockLevel,
      lastUpdated: this.getToday()
    };

    if (existingStock.id === undefined) return;

    this.stockService.update(existingStock.id, stock).subscribe(() => {
      this.createStockTransaction(payload);
    });
  }

  private createStockTransaction(payload: any): void{
    this.sotckTransactionService.get().subscribe(transactions => {
      const transaction: StockTransactionModel = {
        ingredientId: payload.ingredientId,
        type: 'purchase',
        direction: 'in',
        quantity: payload.quantity,
        unitId: payload.unitId,
        costPerUnit: this.getCostPerUnit(
          payload.quantity,
          payload.totalCost
        ),
         totalCost: payload.totalCost,
        reference: this.generatePurchaseReference(transactions),
        note: 'Stock purchase',
        date: this.getToday()
      };

      this.sotckTransactionService.create(transaction).subscribe(res => {
        this.closeDialog();
      })
    })
  }

  private generatePurchaseReference(transactions: StockTransactionModel[]): string {
    const numbers = transactions
      .filter(transaction => transaction.type === 'purchase')
      .map(transaction => {
        const match = transaction.reference?.match(/^PO-(\d+)$/);
        return match ? Number(match[1]) : 0;
      });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `PO-${String(nextNumber).padStart(4, '0')}`;
  }

  private getCostPerUnit(quantity: number, totalCost: number ): number {
    return quantity > 0 ? Number((totalCost / quantity).toFixed(2)) : 0;
  }

  private createNewStock(payload: any): void{
    const averageCost = this.getCostPerUnit(payload.quantity, payload.totalCost);

    const stock: Stock = {
      ingredientId: payload.ingredientId,
      quantity: payload.quantity,
      unitId: payload.unitId,
      averageCostPerUnit: averageCost,
      totalCost: payload.totalCost,
      status: payload.status,
      minStockLevel: payload.minStockLevel,
      maxStockLevel: payload.maxStockLevel,
      lastUpdated: this.getToday()
    };

    this.stockService.create(stock).subscribe(() => {
      this.createStockTransaction(payload);
    })
  }

  private onUpdate(): void {
    const payload =  this.getPayload();

    this.stockService.getById(this.id).subscribe(oldStock => {
      const quantityChange =  payload.quantity - Number(oldStock.quantity);
      this.stockService.update(this.id, {
        ...payload,
        averageCostPerUnit: this.getCostPerUnit(
          payload.quantity,
          payload.totalCost
        ),
        lastUpdated: this.getToday()
      }).subscribe(() => {
         if (quantityChange === 0) {
        this.dialogRef.close(true);
        return;
      }

      this.createUpdateTransaction(
        payload,
        quantityChange,
        oldStock
      );
      })
    })
  }

  private createUpdateTransaction(
    payload: any,
    quantityChange: number,
    oldStock: Stock
  ): void {
    this.sotckTransactionService.get().subscribe(transactions => {
      const quantity = Math.abs(quantityChange);

      const transaction: StockTransactionModel = {
        ingredientId: payload.ingredientId,
        type: 'adjustment',
        direction: quantityChange > 0 ? 'in' : 'out',
        quantity,
        unitId: payload.unitId,
        costPerUnit: this.getCostPerUnit(
          quantity,
          payload.totalCost
        ),
        totalCost: Number(
          (quantity * payload.totalCost / payload.quantity).toFixed(2)
        ),
        reference: this.generateAdjustmentReference(transactions),
        note: 'Stock updated manually',
        date: this.getToday()
      };

      this.sotckTransactionService.create(transaction).subscribe(() => {
        this.dialogRef.close(true);
      });
    });
  }

  private generateAdjustmentReference(
    transactions: StockTransactionModel[]
  ): string {
    const numbers = transactions
      .filter(transaction => transaction.type === 'adjustment')
      .map(transaction => {
        const match = transaction.reference?.match(/^ADJ-(\d+)$/);
        return match ? Number(match[1]) : 0;
      });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `ADJ-${String(nextNumber).padStart(4, '0')}`;
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}