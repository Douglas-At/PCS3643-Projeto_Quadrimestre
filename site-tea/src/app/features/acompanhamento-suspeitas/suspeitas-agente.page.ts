import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-suspeitas-agente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suspeitas-agente.page.html',
})
export class SuspeitasAgentePage implements OnInit {
  
  private API_URL = 'http://localhost:5000/api';
  registros = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarRegistros();
  }

  alterarStatus(registroId: number, event: Event) {
  const novoStatus = (event.target as HTMLSelectElement).value;

  this.http
    .put(`${this.API_URL}/registros/${registroId}/status`, { status: novoStatus })
    .subscribe({
      next: () => {
        // Atualiza a lista após mudança
        this.carregarRegistros();
      },
      error: (err) => console.error("Erro ao atualizar status", err)
    });
}


  carregarRegistros() {
    this.http
      .get<any[]>(`${this.API_URL}/registros/sem-agente`)
      .subscribe({
        next: (dados) => this.registros.set(dados),
        error: (err) => console.error("Erro ao carregar registros", err)
      });
  }
}
