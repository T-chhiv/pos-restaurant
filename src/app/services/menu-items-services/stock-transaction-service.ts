import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { StockTransactionModel } from '../../models/ingredient-model';

@Injectable({
  providedIn: 'root',
})
export class StockTransactionService {
  private url = 'http://localhost:3000/stockTransactions';

  constructor(private http: HttpClient) {}

  get(): Observable<StockTransactionModel[]> {
    return this.http.get<StockTransactionModel[]>(this.url);
  }

  getById(id: number): Observable<StockTransactionModel> {
    return this.http.get<StockTransactionModel>(`${this.url}/${id}`);
  }

  update(
    id: number,
    data: StockTransactionModel
  ): Observable<StockTransactionModel> {
    return this.http.put<StockTransactionModel>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  create(data: StockTransactionModel): Observable<StockTransactionModel> {
    return this.get().pipe(
      map(transactions => {
        const maxId = transactions.length
          ? Math.max(...transactions.map(transaction => transaction.id ?? 0))
          : 0;

        return { ...data, id: maxId + 1 };
      }),
      switchMap(transaction =>
        this.http.post<StockTransactionModel>(this.url, transaction)
      )
    );
  }
}
