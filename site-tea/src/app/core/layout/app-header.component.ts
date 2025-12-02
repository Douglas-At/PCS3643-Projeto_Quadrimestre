import { Component, signal, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { NgIf } from "@angular/common";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: "./app-header.component.html",
})
export class AppHeader {
  open = signal(false);
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigateByUrl("/");
  }
}
