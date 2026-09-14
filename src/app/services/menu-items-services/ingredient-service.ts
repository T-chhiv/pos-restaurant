import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../../models/ingredient-model';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private url = 'http://localhost:3000/ingredients';

  constructor( private http: HttpClient ) {}

  get(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.url);
  }

  getById(id: number):Observable<Ingredient>{
    return this.http.get<Ingredient>(`${this.url}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  create(data: Ingredient): Observable<Ingredient> {
    return this.http.get<Ingredient[]>(this.url).pipe(
      map(ingredients => {
        const maxId = ingredients.length > 0 ? Math.max(...ingredients.map(ingredient => ingredient.id)) : 0;
        return { ...data, id: maxId + 1 };
      }),
      switchMap(newIngredient => this.http.post<Ingredient>(this.url, newIngredient))
    );
  }

  update(id: number, data: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.url}/${id}`, data);
  }
} 
