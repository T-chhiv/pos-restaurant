import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Unit } from '../../models/unit-model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private url = 'http://localhost:3000/units';

  constructor(private http: HttpClient){}

  create(data: Unit): Observable<Unit> {
    return this.get().pipe(
      map(units => {
        const maxId = units.length > 0
            ? Math.max(...units.map(unit => unit.id))
            : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),

      switchMap(newUnit =>
        this.http.post<Unit>(
          this.url,
          newUnit
        )
      )
    );
  }

  get():Observable<Unit[]>{
    return this.http.get<Unit[]>(this.url)
  }

  getById(id: number): Observable<Unit>{
    return this.http.get<Unit>(`${this.url}/${id}`)
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  update(id: number, data: Unit):Observable<Unit>{
    return this.http.put<Unit>(`${this.url}/${id}`, data)
  }
}
