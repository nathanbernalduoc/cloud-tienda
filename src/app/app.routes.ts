import { Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { CarroComponent } from './components/carro/carro.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/principal', pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'carro', component: CarroComponent, canActivate: [AuthGuard] }
];
