import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private API_URL = 'http://localhost:5000/api/professores';

  escolas = signal<any[]>([]);
  alunos = signal<any[]>([]);
  escolaSelecionada = signal<number | null>(null);
  usuario: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      this.carregarEscolas();
    }
  }

  carregarEscolas() {
    this.http
      .get<any[]>(`${this.API_URL}/${this.usuario.id}/escolas`)
      .subscribe({
        next: (dados) => this.escolas.set(dados),
        error: (err) => console.error('Erro ao carregar escolas', err),
      });
  }

  selecionarEscola(event: Event) {
    const select = event.target as HTMLSelectElement;
    const idEscola = Number(select.value);
    this.escolaSelecionada.set(idEscola);
    this.carregarAlunos(idEscola);
  }

  carregarAlunos(idEscola: number) {
    this.http
      .get<any[]>(`${this.API_URL}/${this.usuario.id}/escolas/${idEscola}/alunos`)
      .subscribe({
        next: (dados) => this.alunos.set(dados),
        error: (err) => console.error('Erro ao carregar alunos', err),
      });
  }

  registrarSuspeita(alunoId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      console.log(`Registrar suspeita para aluno ${alunoId}`);
      // futuramente: enviar POST para /api/registros
      // this.http.post('/api/registros', { aluno_id: alunoId, professor_id: this.usuario.id, descricao: "..." })
    } else {
      console.log(`Checkbox desmarcada para aluno ${alunoId}`);
    }
  }
}
