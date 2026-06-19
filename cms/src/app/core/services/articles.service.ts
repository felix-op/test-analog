import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  http = inject(HttpClient);

  getArticle(id: string) {
    return this.http.get<{ value: string }>(`/api/v1/article/${id}`);
  }
}
