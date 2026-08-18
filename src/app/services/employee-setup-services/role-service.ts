import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Role } from '../../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private url = 'http://localhost:3000/roles';
  
    constructor(private http: HttpClient){}
  
    create(data: Role): Observable<Role> {
      return this.get().pipe(
        map(roles => {
          const maxId =
            roles.length > 0
              ? Math.max(...roles.map(role => role.id))
              : 0;
  
          return {
            ...data,
            id: maxId + 1,
          };
        }),
  
        switchMap(newRole =>
          this.http.post<Role>(
            this.url,
            newRole
          )
        )
      );
    }
  
    get(): Observable<Role[]>{
      return this.http.get<Role[]>(this.url);
    }
  
    getById(id: number):Observable<Role>{
      return this.http.get<Role>(`${this.url}/${id}`)
    }
  
    delete(id: number):Observable<void>{
      return this.http.delete<void>(`${this.url}/${id}`)
    }
  
    update(id:number, data: Role):Observable<Role>{
      return this.http.put<Role>(`${this.url}/${id}`, data)
    }
}
