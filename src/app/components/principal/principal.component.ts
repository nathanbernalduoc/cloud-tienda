import { formatDate, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// MSAL imports
import { MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { loginRequest } from '../../auth-config';

import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-principal',
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
  providers: [ProductoService, HttpClient]
})
export class PrincipalComponent implements OnInit {

  productos = {};
  carro = {};
  usuarioId: number = 0;
  carro_items: number = 0;

  /** Email of the logged-in user (undefined when not authenticated) */
  userEmail?: string;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private msalService: MsalService,
  ) {
    // Retrieve products and cart
    this.getProducto();
    this.usuarioId = JSON.parse(localStorage.getItem("usuarioId") || "0");
    this.getCarro(1);
  }

  ngOnInit(): void {
    // Initialize MSAL instance before accessing accounts
    this.msalService.initialize().subscribe(() => {
      // Determine existing account on app init
      this.setUserFromAccount(this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0]);

      // Listen for MSAL login/logout events
      this.msalService.instance.addEventCallback((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload && (event.payload as any).account) {
          const account = (event.payload as any).account as AccountInfo;
          this.msalService.instance.setActiveAccount(account);
          this.setUserFromAccount(account);
          // Redirect to home (principal)
          this.router.navigate(["/principal"]);
        }

        if (event.eventType === EventType.LOGOUT_END) {
          this.setUserFromAccount(undefined);
          this.router.navigate(["/principal"]);
        }
      });
    });
  }

  /** Helper to set local user email */
  private setUserFromAccount(account?: AccountInfo) {
    this.userEmail = account ? account.username : undefined;
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

  // ---------- Authentication methods ----------

  login(): void {
    this.msalService.loginPopup(loginRequest).subscribe((result: AuthenticationResult) => {
      if (result && result.account) {
        this.msalService.instance.setActiveAccount(result.account);
        this.setUserFromAccount(result.account);
        this.router.navigate(["/principal"]);
      }
    });
  }

  logout(): void {
    this.msalService.logoutPopup().subscribe(() => {
      this.setUserFromAccount(undefined);
    });
  }

  goCarro(): void {

    console.log("Navegando a carro")
    this.router.navigate(['/carro']);

  }

}
