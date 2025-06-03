import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationResult } from '@azure/msal-browser';
import { loginRequest } from '../auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private msalService: MsalService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    }

    return this.msalService.loginPopup(loginRequest).pipe(
      map((result: AuthenticationResult) => {
        if (result && result.account) {
          this.msalService.instance.setActiveAccount(result.account);
          localStorage.setItem("token", result.idToken);
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/principal']);
        return of(false);
      })
    );
  }
}
