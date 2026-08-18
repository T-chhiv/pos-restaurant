import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '../../models/employee-model';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private url = 'http://localhost:3000/positions';

  constructor(
    private http: HttpClient
  ){}

  create(data: Position):Observable<Position>{
    return this.get().pipe(
      map(positions => {
        const maxId = positions.length > 0 ? Math.max(...positions.map(position => position.id)) : 0;
        return {...data, id: maxId + 1};
      }),

      switchMap(newPosition => this.http.post<Position>(this.url, newPosition))
    )
  }

  get(): Observable<Position[]>{
    return this.http.get<Position[]>(this.url);
  }

  getById(id: number):Observable<Position>{
    return this.http.get<Position>(`${this.url}/${id}`)
  }

  delete(id: number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  update(id:number, data: Position):Observable<Position>{
    return this.http.put<Position>(`${this.url}/${id}`, data)
  }
}
