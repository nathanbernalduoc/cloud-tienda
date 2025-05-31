import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

//  private url = "http://20.110.161.21/producto";
  private url = "http://localhost:8081/producto";

  constructor(private http: HttpClient) { }

  getProducto(): Observable<any> {
    console.log("Accediendo endpoint: "+this.url);
    return this.http.get(this.url);
  }

}
