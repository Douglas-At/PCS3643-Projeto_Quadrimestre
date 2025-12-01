import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-m-chat-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './m-chat.page.html',
})
export class MChatPage {
  private fb = inject(FormBuilder);

  started = signal(false);
  currentIndex = signal(0);
  answers = signal<Record<number, boolean>>({});

  scrollToQuestionnaire() {
    const iframe = document.getElementById('questionnaireIframe');
    if (iframe) {
      iframe.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
