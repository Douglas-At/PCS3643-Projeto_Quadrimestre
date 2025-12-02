import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acompanhamento-suspeitas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suspeitas-agente.page.html'
})
export class AcompanhamentoSuspeitasPage implements OnInit {
  private API_URL = 'http://localhost:5000/api';

  usuario: any;

  // Kanban signals
  abertas = signal<any[]>([]);
  andamento = signal<any[]>([]);
  concluidas = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      this.carregarSuspeitas();
    }
  }

  carregarSuspeitas() {
    if (!this.usuario?.id) return;

    this.http
      .get<any[]>(`${this.API_URL}/agentes/${this.usuario.id}/suspeitas`)
      .subscribe({
        next: (dados) => {
          this.abertas.set(dados.filter(s => s.status === 'aberto'));
          this.andamento.set(dados.filter(s => s.status === 'em_andamento'));
          this.concluidas.set(dados.filter(s => s.status === 'concluido'));
        },
        error: (err) => console.error('Erro ao carregar suspeitas', err),
      });
  }
}
