import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  //private url = "https://hw35efgkkd.execute-api.us-east-1.amazonaws.com/desarrollo";
  //private url = "http://20.110.161.21";
  private url = "http://localhost:8080";
  producto = {}

  constructor(
    private http: HttpClient,
    private msalService: MsalService
  ) { }

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.msalService.initialize()).pipe(
      switchMap(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error('No authentication token available');
          throw new Error('No authentication token available');
        }
        return of(new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }));
      }),
      catchError(error => {
        console.error('Error getting auth headers:', error);
        throw error;
      })
    );
  }

  getProducto(): Observable<any> {
    console.log("Accediendo endpoint: "+this.url);
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(this.url+"/producto", { headers }))
    );
  }

  getProductoId(productoId: number): Observable<any> {
    console.log("Accediendo endpoint: "+this.url+"/producto/"+productoId);
    return this.getHeaders().pipe(
      switchMap(
        headers =>
          this.http.get(this.url+"/producto/"+productoId, { headers })
      )
    );
  }

  getCarro(usuarioId: String): Observable<any> {
    console.log("recuperando carro: "+this.url+"\n"+usuarioId);
    var uri = this.url+"/carro/"+usuarioId;
    console.log("Uri "+uri);
    return this.getHeaders().pipe(
      switchMap(
        headers => this.http.get(uri, { headers }))
    );
  }

  setCarro(carro: any): Observable<any> {
    let fecha = new Date();
    let dia = (( fecha.getDate() < 10 ) ? "0":"" )+fecha.getDate();
    let mes = (( fecha.getMonth() + 1 < 10 ) ? "0":"" )+(fecha.getMonth()+1);
    let fechaStr = `${fecha.getFullYear()}-${mes}-${dia}`;
    carro.registroFecha = fechaStr;

    console.log("guardando seleccion: "+this.url+"\n"+carro);
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post(this.url+"/carro", carro, { headers }))
    );
  }

  unsetCarro(productoId: number): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.delete(this.url+"/carro/"+productoId, { headers }))
    );
  }

  getTicketId(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(this.url+"/ticket/gen", { headers }))
    );
  }

  getHtmlContent(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }

}
