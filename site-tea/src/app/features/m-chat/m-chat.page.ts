import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

interface MChatQuestion {
  id: number;
  text: string;
}

@Component({
  selector: 'app-m-chat-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './m-chat.page.html',
})
export class MChatPage {
  private fb = inject(FormBuilder);

  // 🔹 Formulário inicial
  form = this.fb.group({
    nome: ['', Validators.required],
    idadeMeses: [null, [Validators.required, Validators.min(16), Validators.max(30)]],
  });

  // 🔹 Estado da página
  started = signal(false);
  currentIndex = signal(0);
  answers = signal<Record<number, boolean>>({});

  questions: MChatQuestion[] = [
    { id: 1, text: 'Seu filho gosta de ser balançado, jogado para cima ou brincadeiras de movimento?' },
    { id: 2, text: 'Seu filho se interessa por outras crianças?' },
    { id: 3, text: 'Seu filho gosta de subir em coisas (móveis, escadas, etc)?' },
  ];

  get currentQuestion() {
    return this.questions[this.currentIndex()];
  }

  // 🔹 Ao clicar em “Iniciar Triagem”
  start() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.started.set(true);
    this.currentIndex.set(0);
  }

  answer(value: boolean) {
    const q = this.currentQuestion;
    this.answers.update(a => ({ ...a, [q.id]: value }));
    if (this.currentIndex() < this.questions.length - 1) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.finish();
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  next() {
    if (this.currentIndex() < this.questions.length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  finish() {
    console.log('Respostas:', this.answers());
    alert('Triagem concluída! Veja o console para detalhes.');
    this.started.set(false); // volta pra tela inicial
  }
    hasAnsweredCurrent() {
    const q = this.currentQuestion;
    return this.answers()[q.id] !== undefined;
    }
}
