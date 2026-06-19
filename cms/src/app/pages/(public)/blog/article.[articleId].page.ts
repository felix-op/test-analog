import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Article } from '@models/article.model';
import { ArticlesService } from '@services/articles.service';

@Component({
  selector: 'app-blog-article',
  template: `
    @if (article()) {
      <h1>{{ article()!.title }}</h1>
      <p>{{ article()!.date }} · {{ article()!.author.name }}</p>
    } @else {
      <p>Cargando artículo...</p>
    }
  `,
})
export default class ArticleDetailPage implements OnInit {
  private articlesService = inject(ArticlesService);

  @Input() articleId: string = '';
  article = signal<Article | null>(null);

  ngOnInit() {
    this.articlesService.getArticle(this.articleId).subscribe({
      next: (data) => this.article.set(data),
      error: (err) => console.error('Error cargando el artículo', err),
    });
  }
}
