import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'login', loadComponent: () => import('./login.component').then((module) => module.LoginComponent) },
	{ path: 'dashboard', loadComponent: () => import('./dashboard.component').then((module) => module.DashboardComponent) },
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: '**', redirectTo: 'login' },
];
