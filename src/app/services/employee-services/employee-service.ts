import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Employee } from '../../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private url = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  // Get all employees
  get(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  // Get employee by ID
  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  // Delete employee
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Update employee
  update(id: number, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.url}/${id}`,
      data
    );
  }

  // Create employee
  create(data: Employee): Observable<Employee> {
    return this.get().pipe(
      map(employees => {
        const maxId =
          employees.length > 0
            ? Math.max(...employees.map(employee => employee.id))
            : 0;

        return {
          ...data,
          id: maxId + 1,
        };
      }),

      switchMap(newEmployee =>
        this.http.post<Employee>(
          this.url,
          newEmployee
        )
      )
    );
  }
}