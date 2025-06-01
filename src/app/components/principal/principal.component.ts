import { formatDate, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-principal',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
  providers: [ProductoService, HttpClient]
})
export class PrincipalComponent {

  productos = {};
  carro = {};
  usuarioId: number = 0;
  carro_items: number = 0;

  constructor(
    private router: Router,
    private productoService: ProductoService,
  ) {
    this.getProducto();
    this.usuarioId = JSON.parse(localStorage.getItem("usuarioId") || "0");
    this.getCarro(1);
  }

  getProducto(): void {

    this.productoService.getProducto().subscribe(
      producto => {
        console.log("Recuperando foros 2 "+JSON.stringify(producto));
        this.productos = producto;
      },
      error => {
        console.log("Se ha producido un error\nApi Recover error: "+error.message+" / "+error.status);
      },
      () => { console.log('Ending!'); } 
    );

  }

  agregarCarro(productoId: number): void {

    console.log("Agregando producto "+productoId);

    this.carro = {
      carroId: null, 
      productoId: productoId, 
      usuarioId: 1,
      cantidad: 1,
      registroFecha: Date.now,
      vigenciaFlag: 1
    };

    this.productoService.setCarro(this.carro).subscribe(
      response => {
        console.log("Producto agregado "+response);
        this.getCarro(1);
      },
      error => {
        console.log("Se ha producido un problema al intentar agregar producto.");
      },
      () => {
        console.log("Finalizado.");
      }
    );

  }

  getCarro(usuarioId: number): void {

    console.log("Usuario "+this.usuarioId+" "+usuarioId);

    this.productoService.getCarro(usuarioId).subscribe(
      carro => {
        console.log(JSON.stringify(carro));
        this.carro = carro;
        this.carro_items = Object.keys(this.carro).length;
      }
    );

  }

  login(): void {
    this.usuarioId = 1;
  }

  goCarro(): void {

    console.log("Navegando a carro")
    this.router.navigate(['/carro']);

  }

}
