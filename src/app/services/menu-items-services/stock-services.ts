import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from '../../models/ingredient-model';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockServices {
  private url = 'http://localhost:3000/stock';

  constructor( private http: HttpClient ) {}

  get():Observable<Stock[]> {
    return this.http.get<Stock[]>(this.url);
  }

  getById(id: number):Observable<Stock>{
    return this.http.get<Stock>(`${this.url}/${id}`);
  }

  update(id: number, data: Stock): Observable<Stock>{
    return this.http.put<Stock>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  create(data: Stock): Observable<Stock> {
    return this.get().pipe(
      map(stocks => {
        const maxId = stocks.length
          ? Math.max(...stocks.map(stock => stock.id ?? 0))
          : 0;

        return { ...data, id: maxId + 1 };
      }),
      switchMap(stock => this.http.post<Stock>(this.url, stock))
    );
  }
}
