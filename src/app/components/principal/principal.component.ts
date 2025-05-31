import { CommonModule } from '@angular/common';
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private jsonService: ProductoService,
  ) {
    this.getProducto();
  }

  getProducto(): void {

    this.jsonService.getProducto().subscribe(
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

}
