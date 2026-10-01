import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { LoginComponent } from './login.component';

describe('App', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter(routes)],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(App);
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should render the login route', async () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();
		await TestBed.inject(Router).navigateByUrl('/login');
		fixture.detectChanges();
		await fixture.whenStable();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain('Welcome back');
	});

	it('should validate login fields before navigating to the dashboard', () => {
		const fixture = TestBed.createComponent(LoginComponent);
		const component = fixture.componentInstance;
		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

		component.signIn();
		expect(component.loginForm.invalid).toBe(true);
		expect(navigateSpy).not.toHaveBeenCalled();

		component.loginForm.setValue({ email: 'jordan@example.com', password: 'securepass' });
		component.signIn();
		expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
	});
});
