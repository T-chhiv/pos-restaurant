import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Department  } from '../../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private url = 'http://localhost:3000/departments';

  constructor(private http: HttpClient){}

  create(data: Department): Observable<Department> {
    return this.get().pipe(
      map(departments => {
        const maxId =
          departments.length > 0
            ? Math.max(...departments.map(department => department.id))
            : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),

      switchMap(newDepartment =>
        this.http.post<Department>(
          this.url,
          newDepartment
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
