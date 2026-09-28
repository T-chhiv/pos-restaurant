import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, Inject, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { ShareMaterialModule } from '../../../../../shareComponents/share-material/share-material-module';
import { Ingredient } from '../../../../../models/ingredient-model';
import { Unit } from '../../../../../models/unit-model';
import { MenuItemCategory } from '../../../../../models/menu-item-model';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';
import { UnitService } from '../../../../../services/unit-category & unit services/unit-service';
import { MenuItemCategoryService } from '../../../../../services/menu-items-services/menu-item-category-service';
import { MenuItemService } from '../../../../../services/menu-items-services/menu-item-service';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, ShareMaterialModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css',
})
export class ItemDetail implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  id?: number;
  form!: FormGroup;

  ingredientList = signal<Ingredient[]>([]);
  units = signal<Unit[]>([]);
  menuCategories = signal<MenuItemCategory[]>([]);

  ingredientSearchControls: FormControl<string | Ingredient | null>[] = [];
  currentIngredientPhotoLink = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private unitService: UnitService,
    private menuCategoryService: MenuItemCategoryService,
    private itemService: MenuItemService,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number } | null,
    private dialogRef: MatDialogRef<ItemDetail>
  ) {
    this.id = data?.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      menuCategoryId: [null, Validators.required],
      itemType: ['', Validators.required],
      price: [0, Validators.required],
      cost: [0, Validators.required],
      image: ['', Validators.required],
      status: [true],
      description: [''],
      ingredients: this.fb.array([]),
    });

    this.form
      .get('image')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: string) => {
        this.currentIngredientPhotoLink.set(res || '');
      });
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  /**
   * Load lookup lists and item detail together via forkJoin.
   * This prevents @for option views from being created mid-check after
   * form.patchValue() triggers Material's internal signal effects (NG0100).
   */
  private loadInitialData(): void {
    forkJoin({
      ingredients: this.ingredientService.get(),
      units: this.unitService.get(),
      categories: this.menuCategoryService.get(),
      itemDetail: this.id ? this.itemService.getById(this.id) : of(null),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ ingredients, units, categories, itemDetail }) => {
        this.ingredientList.set(
          [...(ingredients ?? [])].filter((item) => item.status).reverse()
        );
        this.units.set([...(units ?? [])].reverse());
        this.menuCategories.set([...(categories ?? [])].reverse());

        if (itemDetail) {
          this.form.patchValue({
            name: itemDetail.name,
            description: itemDetail.description,
            menuCategoryId: itemDetail.menuCategoryId,
            itemType: itemDetail.itemType,
            price: itemDetail.price,
            cost: itemDetail.cost,
            image: itemDetail.image,
            status: itemDetail.status,
          });

          this.ingredients.clear();
          this.ingredientSearchControls = [];

          itemDetail.ingredients?.forEach((ingredient: any) => {
            this.ingredients.push(this.createIngredient(ingredient));
          });
        }

        this.cdr.markForCheck();
      });
  }

  private createIngredient(data?: any): FormGroup {
    const group = this.fb.group({
      ingredientId: [data?.ingredientId ?? null, Validators.required],
      quantity: [data?.quantity ?? 0, Validators.required],
      unitId: [data?.unitId ?? null, Validators.required],
    });

    this.ingredientSearchControls.push(new FormControl(''));
    return group;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
    this.ingredientSearchControls.splice(index, 1);
  }

  selectIngredient(index: number, ingredient: Ingredient): void {
    this.ingredients.at(index).patchValue({
      ingredientId: ingredient.id,
    });

    this.ingredientSearchControls[index].setValue('', {
      emitEvent: false,
    });
  }

  removeIngredientChip(index: number): void {
    this.ingredients.at(index).patchValue({
      ingredientId: null,
    });

    this.ingredientSearchControls[index].setValue('', {
      emitEvent: false,
    });
  }

  getSelectedIngredient(index: number): Ingredient | null {
    const rawId = this.ingredients.at(index)?.get('ingredientId')?.value;
    if (!rawId) return null;

    const ingredientId = Number(rawId);
    return (
      this.ingredientList().find((ingredient) => ingredient.id === ingredientId) ??
      null
    );
  }

  getFilteredIngredients(index: number): Ingredient[] {
    const rawValue = this.ingredientSearchControls[index]?.value;
    // Guard against object value when mat-autocomplete selects an Ingredient option
    const search =
      typeof rawValue === 'string' ? rawValue.toLowerCase().trim() : '';

    const currentRowId = Number(
      this.ingredients.at(index)?.get('ingredientId')?.value
    );

    const selectedIds = this.ingredients.controls
      .map((control) => Number(control.get('ingredientId')?.value))
      .filter((id) => !Number.isNaN(id) && id > 0);

    return this.ingredientList().filter((ingredient) => {
      const isSelectedInAnotherRow =
        selectedIds.includes(ingredient.id) && ingredient.id !== currentRowId;

      const matchesSearch =
        !search || ingredient.name.toLowerCase().includes(search);

      return !isSelectedInAnotherRow && matchesSearch;
    });
  }

  displayIngredient(): string {
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.id ? this.onUpdate() : this.onCreate();
  }

  private onCreate(): void {
    this.itemService
      .create(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDialog();
      });
  }

  private onUpdate(): void {
    if (!this.id) return;
    this.itemService
      .update(this.id, this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDialog();
      });
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
};