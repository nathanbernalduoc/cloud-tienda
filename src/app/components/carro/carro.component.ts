import { Component } from '@angular/core';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import { ProductoService } from '../../services/producto.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-carro',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
  providers: [ProductoService, HttpClient]
})
export class CarroComponent {

  carro = {};
  producto = {};
  productos: any = new Array();
  usuarioId: number = 0;
  carro_items: number = 0;
  carro_total: number = 0;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private msalService: MsalService,
  ) {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authentication token found, redirecting to principal");
      this.router.navigate(['/principal']);
      return;
    }

    this.usuarioId = JSON.parse(localStorage.getItem("usuarioId") || "0");
    this.getCarro(localStorage.getItem("username") || "");
  }

  getCarro(usuarioId: String): void {

    console.log("Usuario "+this.usuarioId+" "+usuarioId);

    this.productoService.getCarro(usuarioId).subscribe(
      carro => {
        console.log("CARRO "+JSON.stringify(carro));
        this.carro = carro;
        this.carro_items = Object.keys(this.carro).length;

        for (const c in Object.keys(carro)) {
          console.log(carro[c]);
          console.log("Producto Id "+carro[c]["productoId"]);
          this.getProducto(carro[c]["productoId"]);
          console.log(this.productos);

        }

      }
    );

  }

  goHome(): void {

    console.log("Volviendo a principal")
    this.router.navigate(['/principal']);

  }

  quitarCarro(productoId: number): void {

    this.productoService.unsetCarro(productoId);

  }

  getProducto(productoId: String): any {

    this.productoService.getProducto().subscribe(
      p => {
        console.log(p);

        for (const clave of Object.keys(p)) {
          console.log(clave, p[clave]);
          this.productos[p[clave]["productoId"]] = p[clave];
          console.log("Producto "+p[clave]["productoId"]+": "+JSON.stringify(this.productos));
        }

      }
    );

  }

}
