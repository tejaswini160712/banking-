import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Employee, EmployeeEditorDialogComponent, SignOutConfirmationDialogComponent } from './dashboard-dialogs';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatPaginatorModule],
  template: `
    <main class="dashboard">
      <header class="topbar">
        <div class="brand"><span class="brand-mark">P</span><span>People Portal</span></div>
        <div class="topbar-actions">
          <div class="user-chip"><span class="avatar">JD</span><span>Jordan Davis</span></div>
          <button mat-button class="logout-link" type="button" (click)="confirmSignOut()">Sign out</button>
        </div>
      </header>

      <div class="dashboard-content">
        <section class="dashboard-heading">
          <div>
            <p class="eyebrow">Team overview</p>
            <h1>Good morning, Jordan</h1>
            <p>Here is what is happening across your team.</p>
          </div>
          <span class="date-label">People dashboard</span>
        </section>

        <section class="stat-grid" aria-label="Team summary">
          <button class="stat stat-button" type="button" [class.active]="selectedView() === 'team'"
            [attr.aria-pressed]="selectedView() === 'team'" aria-controls="dashboard-list" (click)="showView('team')">
            <span class="stat-label">Team members</span><span class="stat-value">{{ employees.length }}</span>
            <span class="stat-foot">View all team members</span>
          </button>
          <button class="stat stat-button" type="button" [class.active]="selectedView() === 'leave'"
            [attr.aria-pressed]="selectedView() === 'leave'" aria-controls="dashboard-list" (click)="showView('leave')">
            <span class="stat-label">On leave today</span><span class="stat-value">{{ leaveCount }}</span>
            <span class="stat-foot">View today's leave list</span>
          </button>
          <button class="stat stat-button" type="button" [class.active]="selectedView() === 'positions'"
            [attr.aria-pressed]="selectedView() === 'positions'" aria-controls="dashboard-list" (click)="showView('positions')">
            <span class="stat-label">Open positions</span><span class="stat-value">{{ positions.length }}</span>
            <span class="stat-foot">View open positions</span>
          </button>
        </section>

        <section id="dashboard-list" aria-labelledby="list-heading">
          <div class="section-heading">
            <h2 id="list-heading">{{ listTitle }}</h2>
            <div class="section-actions">
              <input
                class="table-search"
                type="search"
                [value]="searchQuery()"
                [attr.aria-label]="'Search ' + listTitle.toLowerCase()"
                [placeholder]="selectedView() === 'positions' ? 'Search positions' : 'Search employees'"
                (input)="onSearch($event)"
              />
              <span>{{ selectedView() === 'leave' ? 'Today' : selectedView() === 'positions' ? 'Currently hiring' : 'All team members' }}</span>
              @if (selectedView() === 'team') {
                <button mat-flat-button color="primary" type="button" (click)="openEditor()">Add employee</button>
              }
            </div>
          </div>
          <div class="employee-table-wrap">
            @if (selectedView() === 'positions') {
              <table class="employee-table">
                <thead><tr>
                  <th [attr.aria-sort]="ariaSort('title')"><button class="table-sort-button" type="button" (click)="sortBy('title')">Position <span aria-hidden="true">{{ sortIndicator('title') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('department')"><button class="table-sort-button" type="button" (click)="sortBy('department')">Department <span aria-hidden="true">{{ sortIndicator('department') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('location')"><button class="table-sort-button" type="button" (click)="sortBy('location')">Location <span aria-hidden="true">{{ sortIndicator('location') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('type')"><button class="table-sort-button" type="button" (click)="sortBy('type')">Type <span aria-hidden="true">{{ sortIndicator('type') }}</span></button></th>
                </tr></thead>
                <tbody>
                  @for (position of filteredPositions; track position.id) {
                    <tr><td class="employee-name">{{ position.title }}</td><td>{{ position.department }}</td><td>{{ position.location }}</td><td>{{ position.type }}</td></tr>
                  } @empty {
                    <tr><td class="empty-state" colspan="4">No matching positions</td></tr>
                  }
                </tbody>
              </table>
            } @else {
              <table class="employee-table">
                <thead><tr>
                  <th [attr.aria-sort]="ariaSort('name')"><button class="table-sort-button" type="button" (click)="sortBy('name')">Employee <span aria-hidden="true">{{ sortIndicator('name') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('department')"><button class="table-sort-button" type="button" (click)="sortBy('department')">Department <span aria-hidden="true">{{ sortIndicator('department') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('role')"><button class="table-sort-button" type="button" (click)="sortBy('role')">Role <span aria-hidden="true">{{ sortIndicator('role') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('location')"><button class="table-sort-button" type="button" (click)="sortBy('location')">Location <span aria-hidden="true">{{ sortIndicator('location') }}</span></button></th>
                  <th [attr.aria-sort]="ariaSort('status')"><button class="table-sort-button" type="button" (click)="sortBy('status')">Status <span aria-hidden="true">{{ sortIndicator('status') }}</span></button></th>
                </tr></thead>
                <tbody>
                  @for (employee of pageEmployees; track employee.id) {
                    <tr>
                      <td><button type="button" class="employee-name-button" (click)="openEditor(employee)" aria-label="Edit {{ employee.name }} details"><span class="avatar">{{ employee.initials }}</span>{{ employee.name }}</button></td>
                      <td>{{ employee.department }}</td><td>{{ employee.role }}</td><td>{{ employee.location }}</td>
                      <td><span class="status" [class.status-leave]="employee.status === 'On leave'">{{ employee.status }}</span></td>
                    </tr>
                  } @empty {
                    <tr><td class="empty-state" colspan="5">No matching employees</td></tr>
                  }
                </tbody>
              </table>
              <mat-paginator
                [length]="filteredEmployees.length"
                [pageIndex]="pageIndex()"
                [pageSize]="pageSize()"
                [pageSizeOptions]="[5, 10, 25]"
                (page)="onPageChange($event)"
                aria-label="Employee list pages"
              />
            }
          </div>
        </section>
      </div>

    </main>
  `,
})
export class DashboardComponent {
  readonly selectedView = signal<'team' | 'leave' | 'positions'>('team');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly searchQuery = signal('');
  readonly sortColumn = signal('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  constructor(private readonly router: Router, private readonly dialog: MatDialog) {}

  employees: Employee[] = [
    { id: 1, initials: 'JD', name: 'Jordan Davis', department: 'Operations', role: 'Team Lead', location: 'New York', status: 'Active' },
    { id: 2, initials: 'AM', name: 'Alex Morgan', department: 'Customer Care', role: 'Support Specialist', location: 'Chicago', status: 'Active' },
    { id: 3, initials: 'RK', name: 'Riley Kim', department: 'Finance', role: 'Financial Analyst', location: 'Remote', status: 'Active' },
    { id: 4, initials: 'ST', name: 'Sam Taylor', department: 'Operations', role: 'People Partner', location: 'New York', status: 'On leave' },
    { id: 5, initials: 'MC', name: 'Morgan Chen', department: 'Customer Care', role: 'Support Specialist', location: 'Chicago', status: 'On leave' },
  ];

  readonly positions = [
    { id: 1, title: 'Product Designer', department: 'Product', location: 'New York', type: 'Full time' },
    { id: 2, title: 'Customer Support Associate', department: 'Customer Care', location: 'Chicago', type: 'Full time' },
    { id: 3, title: 'Financial Analyst', department: 'Finance', location: 'Remote', type: 'Full time' },
  ];

  get filteredEmployees() {
    const query = this.searchQuery().toLocaleLowerCase();
    const employees = this.selectedView() === 'leave'
      ? this.employees.filter((employee) => employee.status === 'On leave')
      : this.employees;
    const matches = employees.filter((employee) =>
      [employee.name, employee.department, employee.role, employee.location, employee.status]
        .some((value) => value.toLocaleLowerCase().includes(query)),
    );
    return this.sortRows(matches, this.sortColumn() as keyof Employee);
  }

  get filteredPositions() {
    const query = this.searchQuery().toLocaleLowerCase();
    const matches = this.positions.filter((position) =>
      [position.title, position.department, position.location, position.type]
        .some((value) => value.toLocaleLowerCase().includes(query)),
    );
    return this.sortRows(matches, this.sortColumn() as keyof (typeof this.positions)[number]);
  }

  get pageEmployees() {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredEmployees.slice(start, start + this.pageSize());
  }

  get leaveCount() {
    return this.employees.filter((employee) => employee.status === 'On leave').length;
  }

  get listTitle() {
    if (this.selectedView() === 'leave') return 'On leave today';
    if (this.selectedView() === 'positions') return 'Open positions';
    return 'Employee details';
  }

  showView(view: 'team' | 'leave' | 'positions'): void {
    this.selectedView.set(view);
    this.pageIndex.set(0);
    this.sortColumn.set(view === 'positions' ? 'title' : 'name');
    this.sortDirection.set('asc');
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value.trim());
    this.pageIndex.set(0);
  }

  sortBy(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.pageIndex.set(0);
  }

  sortIndicator(column: string): string {
    if (this.sortColumn() !== column) return '';
    return this.sortDirection() === 'asc' ? '▲' : '▼';
  }

  ariaSort(column: string): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  private sortRows<T>(rows: T[], column: keyof T): T[] {
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    return [...rows].sort((left, right) =>
      String(left[column] ?? '').localeCompare(String(right[column] ?? ''), undefined, {
        numeric: true,
        sensitivity: 'base',
      }) * direction,
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openEditor(employee?: Employee): void {
    this.dialog.open<EmployeeEditorDialogComponent, Employee, Employee>(EmployeeEditorDialogComponent, {
      data: employee ?? null,
      width: 'min(520px, calc(100vw - 32px))',
      maxHeight: '90vh',
    }).afterClosed().subscribe((updatedEmployee) => {
      if (updatedEmployee && employee) {
        this.employees = this.employees.map((item) => item.id === updatedEmployee.id ? updatedEmployee : item);
      } else if (updatedEmployee) {
        const id = Math.max(0, ...this.employees.map((item) => item.id)) + 1;
        this.employees = [...this.employees, { ...updatedEmployee, id }];
        this.searchQuery.set('');
        this.showView('team');
        this.pageIndex.set(Math.floor((this.employees.length - 1) / this.pageSize()));
      }
    });
  }

  confirmSignOut(): void {
    this.dialog.open<SignOutConfirmationDialogComponent, void, boolean>(SignOutConfirmationDialogComponent, {
      width: 'min(430px, calc(100vw - 32px))',
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) void this.router.navigateByUrl('/login');
    });
  }
}