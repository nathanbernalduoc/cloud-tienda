import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  private url = "http://localhost:8081";
  producto = {}

  constructor(private http: HttpClient) { }

  getProducto(): Observable<any> {

    console.log("Accediendo endpoint: "+this.url);
    return this.http.get(this.url+"/producto");

  }

  getCarro(usuarioId: number): Observable<any> {

    console.log("recuperando carro: "+this.url+"\n"+usuarioId);
    var uri = this.url+"/carro/"+usuarioId;
    console.log("Uri "+uri);
    return this.http.get(uri);

  }

  setCarro(carro: any): Observable<any> {

    let fecha = new Date();
    let dia = (( fecha.getDate() < 10 ) ? "0":"" )+fecha.getDate();
    let mes = (( fecha.getMonth() + 1 < 10 ) ? "0":"" )+(fecha.getMonth()+1);
    let fechaStr = `${fecha.getFullYear()}-${mes}-${dia}`;
    carro.registroFecha = fechaStr;

    console.log("guardando seleccion: "+this.url+"\n"+carro);
    return this.http.post(this.url+"/carro", carro);

  }

  unsetCarro(productoId: number): void {
    this.http.delete(this.url+"/carro/"+productoId);
  }

}
