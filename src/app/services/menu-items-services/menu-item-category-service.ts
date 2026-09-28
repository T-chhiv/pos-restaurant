import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { MenuItemCategory } from '../../models/menu-item-model';

@Injectable({
  providedIn: 'root',
})
export class MenuItemCategoryService {
  private url = 'http://localhost:3000/menuCategories';

  constructor(private http: HttpClient){}

  create(data: MenuItemCategory): Observable<MenuItemCategory> {
    return this.get().pipe(
      map(categories => {
        const maxId = categories.length > 0
          ? Math.max(...categories.map(category => category.id))
          : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),
      switchMap(newCategory =>
        this.http.post<MenuItemCategory>(this.url, newCategory)
      )
    );
  }

  get():Observable<MenuItemCategory[]>{
    return this.http.get<MenuItemCategory[]>(this.url);
  }

  getById(id: number):Observable<MenuItemCategory>{
    return this.http.get<MenuItemCategory>(`${this.url}/${id}`);
  }

  delete(id: number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  update(id: number, data: MenuItemCategory):Observable<MenuItemCategory>{
    return this.http.put<MenuItemCategory>(`${this.url}/${id}`, data)
  }

}
