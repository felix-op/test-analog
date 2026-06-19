import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PageServerLoad } from '@analogjs/router';
import { injectLoad } from '@analogjs/router';
import { ArticlesService } from '@services/articles.service';

// Sin withComponentInputBinding()
// import { inject} from '@angular/core';
// import { AsyncPipe } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { map } from 'rxjs';

// 1. Este loader se ejecuta ESTRICTAMENTE en el servidor (Nitro)
// export const load = async ({ params }: PageServerLoad) => {
//   const id = params?.['id']!;

//   // Llamada interna directa al endpoint de Nitro que creamos arriba
//   const article = await $fetch(`/api/v1/articles/${id}`);

//   return { article };
// };

@Component({
    selector: 'app-blog-article-tab',
    // Sin withComponentInputBinding
    // imports: [AsyncPipe],
    template: `
        <h2>Article Details</h2>

        <!-- Sin withComponentInputBinding() -->
        <!-- ID: {{ articleId$ | async }} -->

        ID: {{ articleId }}
        Article data: {{ article() }}
    `,
})
export default class ArticleDetailTab implements OnInit {
    private articlesService = inject(ArticlesService);
    // Sin withComponentInputBinding()
    // private readonly route = inject(ActivatedRoute);

    // readonly articleId$ = this.route.paramMap.pipe(
    //     map((params) => params.get('articleId')),
    // );

    // Con withComponentInputBinding()
    @Input() articleId: string = "";
    //public data = injectLoad<typeof load>()
    public article = signal<string>("");

    ngOnInit() {
        // HttpClient se dispara. En SSR hará la petición, en cliente usará TransferState.
        this.articlesService.getArticle(this.articleId).subscribe({
            next: (data) => this.article.set(data.value),
            error: (err) => console.error('Error cargando el contenido', err)
        });
    }
}
