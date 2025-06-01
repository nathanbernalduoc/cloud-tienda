import { Component } from '@angular/core';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import { ProductoService } from '../../services/producto.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-carro',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
  providers: [ProductoService, HttpClient]
})
export class CarroComponent {

  carro = {};
  usuarioId: number = 0;
  carro_items: number = 0;

  constructor(
    private router: Router,
    private productoService: ProductoService,
  ) {
    this.usuarioId = JSON.parse(localStorage.getItem("usuarioId") || "0");
    this.getCarro(1);
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

  goHome(): void {

    console.log("Volviendo a principal")
    this.router.navigate(['/principal']);

  }

  quitarCarro(productoId: number): void {

    this.productoService.unsetCarro(productoId).subscribe(
      response => {
        console.log("Response "+JSON.stringify(response));
      }
    );

  }

}
