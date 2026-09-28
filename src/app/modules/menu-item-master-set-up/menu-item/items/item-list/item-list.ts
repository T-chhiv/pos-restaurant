import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MenuItem, MenuItemCategory } from '../../../../../models/menu-item-model';
import { MenuItemService } from '../../../../../services/menu-items-services/menu-item-service';
import { MenuItemCategoryService } from '../../../../../services/menu-items-services/menu-item-category-service';
import { ItemDetail } from '../item-detail/item-detail';
import { IngredientService } from '../../../../../services/menu-items-services/ingredient-service';
import { UnitService } from '../../../../../services/unit-category & unit services/unit-service';
import { Unit } from '../../../../../models/unit-model';
import { Ingredient } from '../../../../../models/ingredient-model';
import { DeleteConfirmationService } from '../../../../../services/Delete-confirmation-service/delete-confirmation-service';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
  animations: [
    trigger('rotateIcon', [
      state('collapsed', style({
        transform: 'rotate(0deg)'
      })),
      state('expanded', style({
        transform: 'rotate(90deg)'
      })),
      transition(
        'collapsed <=> expanded',
        animate('300ms ease-out')
      )
    ]),

    trigger('detailExpand', [
      state('collapsed', style({
        height: '0px',
        minHeight: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'hidden'
      })),
      transition(
        'collapsed <=> expanded',
        animate('300ms ease-out')
      )
    ])
  ]
})
export class ItemList implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;

  menuItems: MenuItem[] = [];
  menuItemCategories: MenuItemCategory[] = [];
  units: Unit[] = [];
  ingredients: Ingredient[] = [];

  categoryMap = new Map<number, string>();

  expandedItem: MenuItem | null = null;

  displayedColumns = [
    'no',
    'image',
    'name',
    'description',
    'menuCategory',
    'itemType',
    'priceAndCost',
    'status',
    'actions'
  ];

  ingredientColumns = [
    'no',
    'image',
    'ingredient',
    'quantity'
  ];

  pageSize = 10;
  pageSizeOptions = [10, 15, 20, 25, 30, 40, 50];

  dataSource = new MatTableDataSource<MenuItem>([]);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private menuItemService: MenuItemService,
    private ingredientService: IngredientService,
    private unitService: UnitService,
    private menuItemCategoryService: MenuItemCategoryService,
    private deleteConfirmationService: DeleteConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIngredient();
    this.loadUnit();
    this.loadMenuItemCategory();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [''],
      menuCategoryId: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  private filter(): void {
    const name = this.form.get('name')?.value ?? '';
    const categoryId = this.form.get('menuCategoryId')?.value;

    const searchName = String(name).toLowerCase().trim();

    const filteredData = this.menuItems.filter(item => {
      const matchName =
        !searchName ||
        String(item.name).toLowerCase().trim().includes(searchName);

      const matchCategory =
        !categoryId ||
        Number(item.menuCategoryId) === Number(categoryId);

      return matchName && matchCategory;
    });

    this.dataSource.data = filteredData;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  private loadMenuItemCategory(): void {
    this.menuItemCategoryService.get().subscribe(res => {
      this.menuItemCategories = [...res].reverse();

      this.categoryMap = new Map(
        this.menuItemCategories.map(category => [
          category.id,
          category.name
        ])
      );

      this.loadMenuItem();

      this.cdr.detectChanges();
    });
  }

  private loadMenuItem(): void {
    this.menuItemService.get().subscribe(res => {
      this.menuItems = [...res].reverse();
      this.dataSource.data = this.menuItems;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      this.cdr.detectChanges();
    });
  }

  private loadUnit(): void {
    this.unitService.get().subscribe(res => {
      this.units = [...res].reverse();
      this.cdr.detectChanges();
    });
  }

  private loadIngredient(): void {
    this.ingredientService.get().subscribe(res => {
      this.ingredients = [...res].reverse();
      this.cdr.detectChanges();
    });
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItem === item;
  }

  toggleRow(item: MenuItem): void {
    this.expandedItem =
      this.expandedItem === item ? null : item;
  }

  getCategoryName(id: number): string {
    return this.categoryMap.get(id) ?? '';
  }

  getUnitNameById(id: number): string {
    const unit = this.units.find(unit => unit.id === id);
    return unit?.name ?? '';
  }

  getIngredientNameById(id: number): string {
    const ingredient = this.ingredients.find(
      ingredient => ingredient.id === id
    );

    return ingredient?.name ?? '';
  }

  getIngredientImageById(id: number): string {
    const ingredient = this.ingredients.find(
      ingredient => ingredient.id === id
    );

    return ingredient?.photo ?? '';
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

      this.menuItemService.delete(id).subscribe(() => {
        this.loadMenuItem();
      });
    });
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(ItemDetail, {
      width: '850px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuItem();
      }
    });
  }
}