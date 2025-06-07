import { Component } from '@angular/core';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import { ProductoService } from '../../services/producto.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { defaultUrlMatcher, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import autoTable from 'jspdf-autotable';

import { ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-carro',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css',
  providers: [ProductoService, HttpClient]
})
export class CarroComponent {

  @ViewChild('ticket.html', { static: false }) content!: ElementRef;

  htmlString: String = "";
  carro = {};
  producto = {};
  productos: any = new Array();
  usuarioId: number = 0;
  carro_items: number = 0;
  carro_total: number = 0;
  ticket_numero: number = 0;
  ticket_contenido: String = "";
  usuario_alias: String = "";

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private msalService: MsalService,
  ) {

    this.usuario_alias = localStorage.getItem("username") || "Indefinido";

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

    console.log("[getCarro] Usuario "+this.usuarioId+" / "+usuarioId);

    this.productoService.getCarro(usuarioId).subscribe(
      carro => {
        console.log("[getCarro] - CARRO "+JSON.stringify(carro));
        this.carro = carro;
        this.carro_items = Object.keys(this.carro).length;

        for (const c in Object.keys(carro)) {

          console.log("[getCarro] - Carro "+JSON.stringify(carro[c]));
          const c2 = JSON.stringify(carro[c]);
          this.getProducto(carro[c]["productoId"]);
          console.log("[getCarro] - Producto "+this.productos);
          
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
    this.generatePDF();

  }

  generatePDF() {

    console.log("[genetarePDF] ");

    this.productoService.getTicketId().subscribe(
      t => {

        const n = t;
        this.ticket_numero = n.ticketId;

        const doc = new jsPDF();

        console.log("[generatePDF] - Preparando archivo");
        doc.setFontSize(16);
        doc.text('Comprobante #'+this.ticket_numero, 10, 10);
        doc.setFontSize(12);
        doc.text(
          'Comprobante de compra, aquí detallamos sus productos:',
          10,
          20,
        );

        const headers = [['#', 'Producto', 'Valor']];
        
        console.log("Productos "+JSON.stringify(this.productos));

        let data = [];
        for(const item of this.productos) {
          if (item) {
            data.push([item["productoId"], item["nombre"], "$ "+item["valorVenta"]]);
          }
        }

        data.push(["Total: $ "+this.carro_total]);

        autoTable(doc, {
          head: headers,
          body: data,
          startY: 30, // Adjust the `startY` position as needed.
        });

        doc.save('ticket-'+this.ticket_numero+'.pdf');
  
      }
    );

  }


  quitarCarro(productoId: number): void {

    this.productoService.unsetCarro(productoId);

  }

  getProducto(productoId: String): any {


    this.productoService.getProductoId(Number(productoId)).subscribe(
      p => {

        console.log("[carro / getProducto] - ",p);
        this.productos[p["productoId"]] = p;
        this.carro_total = this.carro_total + p["valorVenta"];

      }
    );

  }

}
