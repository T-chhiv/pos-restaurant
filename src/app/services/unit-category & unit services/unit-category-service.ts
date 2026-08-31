import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitCategory } from '../../models/unit-model';
import { map, Observable, switchMap } from 'rxjs';
import { Department } from '../../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class UnitCategoryService {
   private url = 'http://localhost:3000/unitCategories';

  constructor(private http: HttpClient){}

  create(data: UnitCategory): Observable<UnitCategory> {
    return this.get().pipe(
      map(unitCategories => {
        const maxId =
          unitCategories.length > 0
            ? Math.max(...unitCategories.map(unitCateogry => unitCateogry.id))
            : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),

      switchMap(newUnitCategory =>
        this.http.post<UnitCategory>(
          this.url,
          newUnitCategory
        )
      )
    );
  }

  get(): Observable<Department[]>{
    return this.http.get<Department[]>(this.url);
  }

  getById(id: number):Observable<Department>{
    return this.http.get<Department>(`${this.url}/${id}`)
  }

  delete(id: number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  update(id:number, data: Department):Observable<Department>{
    return this.http.put<Department>(`${this.url}/${id}`, data)
  }
}
