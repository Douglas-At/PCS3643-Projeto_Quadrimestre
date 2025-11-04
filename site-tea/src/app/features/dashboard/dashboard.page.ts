import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  userName = 'Professor'; // 🔹 Exemplo fixo (pode vir do AuthService)
  stats = [
    { label: 'Triagens realizadas', value: 18 },
    { label: 'Alertas de atenção', value: 4 },
    { label: 'Alunos monitorados', value: 12 },
  ];
}
