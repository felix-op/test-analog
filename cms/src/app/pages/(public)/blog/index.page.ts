// import { Component } from '@angular/core';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { injectContentFiles } from '@analogjs/content';

import { RouteMeta } from "@analogjs/router";

// export interface PostAttributes {
//   title: string;
//   slug: string;
//   description: string;
//   coverImage: string;
// }

// @Component({
//   selector: 'app-blog-tab',
//   standalone: true,
//   imports: [RouterLink],
//   template: `
//     <ul>
//       @for (post of posts; track post.slug) {
//         <li>
//           <a [routerLink]="['/blog', 'posts', post.slug]">
//             {{ post.attributes.title }}
//           </a>
//         </li>
//       } @empty {
//         <li>No posts yet.</li>
//       }
//     </ul>
//   `,
// })
// export default class BlogTab {
//   readonly posts = injectContentFiles<PostAttributes>((contentFile) =>
//     contentFile.filename.includes('src/content/blog-content'),
//   );
// }

export const routeMeta: RouteMeta = {
  redirectTo: '/blog/explorer',
  pathMatch: 'full',
};
