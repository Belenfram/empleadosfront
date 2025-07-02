import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  //propiedades
  baseUri: string = 'https://emp-back-4ibl.onrender.com/api'; //esta parte se cambia cuando se hostee
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http:HttpClient) { }

  //método para agregar un empleado
  agregarEmpleado(data:any) : Observable<any> {
    let url =  `${this.baseUri}/agregar`;
    return this.http.post(url,data)
      .pipe(catchError(this.errorManager));
  }

  //método para obtener el listado de todos los empleados
  getEmpleados() {
    let url =  `${this.baseUri}/empleados`;
    return this.http.get(url);
  }

  //método para obtener un empleado por su ID
  getEmpleado(id:any) : Observable<any> {
    let url =  `${this.baseUri}/empleado/${id}`;
    return this.http.get(url, {headers: this.headers})
      .pipe(map((res:any) => {
        return res || {};
      }),
      catchError(this.errorManager)
    );
  }

  //método para actualizar un empleado
  actualizarEmpleado(id:any, data:any) : Observable<any> {
    let url =  `${this.baseUri}/actualizar/${id}`;
    return this.http.put(url,data, {headers: this.headers})
      .pipe(catchError(this.errorManager));
  }

  //método para eliminar un empleado
  eliminarEmpleado(id:any) : Observable<any> {
    let url =  `${this.baseUri}/eliminar/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .pipe(catchError(this.errorManager));
  }

  //manejador de errores
  errorManager(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      //el error está del lado del cliente
      errorMessage = error.error.message;
    }else {
      //el error está del lado del servidor
      errorMessage = `Error: ${error.status} \n Mensaje: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

}
