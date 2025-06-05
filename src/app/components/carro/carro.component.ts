import { Component } from '@angular/core';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import { ProductoService } from '../../services/producto.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';

import { ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-carro',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
  providers: [ProductoService, HttpClient]
})
export class CarroComponent {

  @ViewChild('ticket.html', { static: false }) content!: ElementRef;

  carro = {};
  producto = {};
  productos: any = new Array();
  usuarioId: number = 0;
  carro_items: number = 0;
  carro_total: number = 0;
  ticket_numero: String = "";
  usuario_alias: String = "";

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

    console.log("Volviendo a principal");
    this.router.navigate(['/principal']);

  }

  goPrint(): void {

    console.log("Volviendo a principal");
    alert('Imprimiendo');

    this.usuario_alias = localStorage.getItem("username") || "Indefinido";
    this.ticket_numero = "321";
    this.generatePDF();

  }

  generatePDF() {
    const dataHtml = document.getElementById('ticketContenido');
    if (dataHtml) {
      html2canvas(dataHtml).then(
        canvas => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png');
          let pdf = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('my-pdf.pdf');
        }
      );
    }
  }

  quitarCarro(productoId: number): void {

    this.productoService.unsetCarro(productoId);

  }

  getProducto(productoId: String): any {

    this.productoService.getProducto().subscribe(
      p => {
        console.log(p);

        this.carro_total = 0;
        for (const clave of Object.keys(p)) {
          console.log(clave, p[clave]);
          this.productos[p[clave]["productoId"]] = p[clave];
          console.log("Producto "+p[clave]["productoId"]+" ($"+p[clave]["valorVenta"]+"): "+JSON.stringify(this.productos));

        }

      }
    );

  }

}
