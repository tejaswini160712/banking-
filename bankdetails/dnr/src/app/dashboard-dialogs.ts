import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface Employee {
  id: number;
  initials: string;
  name: string;
  department: string;
  role: string;
  location: string;
  status: 'Active' | 'On leave';
}

@Component({
  selector: 'app-employee-editor-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ employee ? 'Edit employee details' : 'Add employee' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="employee-dialog-content">
        <mat-form-field appearance="outline"
          ><mat-label>Employee name</mat-label><input matInput formControlName="name" required
        /></mat-form-field>
        <mat-form-field appearance="outline"
          ><mat-label>Department</mat-label><input matInput formControlName="department" required
        /></mat-form-field>
        <mat-form-field appearance="outline"
          ><mat-label>Role</mat-label><input matInput formControlName="role" required
        /></mat-form-field>
        <mat-form-field appearance="outline"
          ><mat-label>Location</mat-label><input matInput formControlName="location" required
        /></mat-form-field>
        <mat-form-field appearance="outline"
          ><mat-label>Status</mat-label>
          <mat-select formControlName="status"
            ><mat-option value="Active">Active</mat-option
            ><mat-option value="On leave">On leave</mat-option></mat-select
          >
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Save changes
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class EmployeeEditorDialogComponent {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<Employee['status']>('Active', { nonNullable: true }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly employee: Employee | null,
    private readonly dialogRef: MatDialogRef<EmployeeEditorDialogComponent, Employee>,
  ) {
    if (employee) {
      this.form.setValue({
        name: employee.name,
        department: employee.department,
        role: employee.role,
        location: employee.location,
        status: employee.status,
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    const name = values.name.trim();
    if (!name || !values.department.trim() || !values.role.trim() || !values.location.trim())
      return;

    const initials = name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    this.dialogRef.close({
      id: this.employee?.id ?? 0,
      ...values,
      name,
      initials,
    });
  }
}

@Component({
  selector: 'app-sign-out-confirmation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Sign out?</h2>
    <mat-dialog-content
      >Are you sure you want to sign out of your employee workspace?</mat-dialog-content
    >
    <mat-dialog-actions align="end">
      <button mat-button type="button" [mat-dialog-close]="false">Stay signed in</button>
      <button mat-flat-button color="primary" type="button" [mat-dialog-close]="true">
        Sign out
      </button>
    </mat-dialog-actions>
  `,
})
export class SignOutConfirmationDialogComponent {}
