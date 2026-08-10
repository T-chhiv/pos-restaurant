import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Employee } from '../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000/employees';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private curretnUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');

    if(savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((employees: Employee[]) => {

        const employee = employees.find((employee: Employee) =>employee.username === username && employee.password === password);

        if (employee) {

          localStorage.setItem('currentUser', JSON.stringify(employee));
          this.currentUserSubject.next(employee);
          return true;
        }
        return false;
      }),

      catchError(() => of(false))
    );
  }

  logout(): void{
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
