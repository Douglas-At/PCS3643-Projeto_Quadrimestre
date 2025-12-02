import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tela-professor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-professor.page.html',
})

export class TelaProfessorPage implements OnInit {
  private API_URL = 'http://localhost:5000/api';
  usuario: any;
  professorId: number | null = null;
  professorNumeroId: number | null = null;

  escolas = signal<any[]>([]);
  alunos = signal<any[]>([]);
  escolaSelecionada = signal<number | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      this.carregarProfessor();
    }
  }

  carregarProfessor() {
    this.http.get<any>(`${this.API_URL}/professores/usuario/${this.usuario.id}`)
      .subscribe({
        next: (dados) => {
          this.professorId = dados.usuario_id;
          this.professorNumeroId = dados.id;
          this.carregarEscolas();
        },
        error: (err) => console.error("Erro ao carregar professor", err)
      });
  }

    carregarEscolas() {
      this.http
        .get<any[]>(`${this.API_URL}/professores/${this.professorId}/escolas`)
        .subscribe({
          next: (dados) => this.escolas.set(dados),
          error: (err) => console.error('Erro ao carregar escolas', err),
        });
    }


  selecionarEscola(event: Event) {
    const select = event.target as HTMLSelectElement;
    const escolaId = Number(select.value);

    this.escolaSelecionada.set(escolaId);

    this.http
      .get<any[]>(`${this.API_URL}/professores/${this.professorId}/escolas/${escolaId}/alunos`
      )
      .subscribe({
        next: (dados) => this.alunos.set(dados),
        error: (err) => console.error("Erro ao carregar alunos", err)
      });
  }

  registrarSuspeita(alunoId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      const payload = {
        aluno_id: alunoId,
        professor_id: this.professorNumeroId,
        descricao: "Suspeita registrada pelo professor"
      };

      this.http.post(`${this.API_URL}/registros`, payload)
        .subscribe({
          next: () => alert("Suspeita registrada!"),
          error: (err) => console.error("Erro ao registrar suspeita", err)
        });
    }
  }
}
