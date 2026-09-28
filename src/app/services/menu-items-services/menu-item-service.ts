import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { MenuItem } from '../../models/menu-item-model';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private url = 'http://localhost:3000/menuItems';

  constructor(private http: HttpClient){}

  create(data: MenuItem): Observable<MenuItem> {
    return this.get().pipe(
      map(menuItems => {
        const maxId = menuItems.length > 0
          ? Math.max(...menuItems.map(item => item.id))
          : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),
      switchMap(newItem =>
        this.http.post<MenuItem>(this.url, newItem)
      )
    );
  }

  get():Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(this.url);
  }

  getById(id: number): Observable<MenuItem>{
    return this.http.get<MenuItem>(`${this.url}/${id}`);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  update(id: number, data: MenuItem):Observable<MenuItem>{
    return this.http.put<MenuItem>(`${this.url}/${id}`, data)
  }
}
