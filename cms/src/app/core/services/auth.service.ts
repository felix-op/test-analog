import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  
  private readonly _isAuthenticated = signal<boolean>(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    this.checkInitialState();
  }

  private checkInitialState() {
    if (typeof window !== "undefined") {
      // Verificamos si la cookie authToken existe
      const isLogged = document.cookie.includes('authToken=');
      this._isAuthenticated.set(isLogged);
    }
  }

  login() {
    return this.http.post<{ success: boolean; token: string }>('/api/v1/login', {}).pipe(
      tap(res => {
        if (res.success) {
          this._isAuthenticated.set(true);
        }
      })
    );
  }

  logout() {
    return this.http.post<{ success: boolean }>('/api/v1/logout', {}).pipe(
      tap(() => {
        this._isAuthenticated.set(false);
      })
    );
  }
}
