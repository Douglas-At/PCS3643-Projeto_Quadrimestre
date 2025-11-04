import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './app-footer.component.html',
})
export class AppFooter {
  year = new Date().getFullYear();
}
