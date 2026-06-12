import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Leemos los parámetros de paginación de la query string (por defecto: página 1, 10 elementos)
    const query = getQuery(event);
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const perPage = query.per_page ? parseInt(query.per_page as string, 10) : 10;

    // Parámetro opcional de filtro por tag/categoría
    const tag = query.tag ? (query.tag as string).toLowerCase() : '';

    // Construimos la URL con paginación y filtro opcional por tag
    let apiUrl = `https://dev.to/api/articles?page=${page}&per_page=${perPage}`;
    if (tag) {
      apiUrl += `&tag=${encodeURIComponent(tag)}`;
    }

    // Consultamos la API pública de DEV.to con la paginación dinámica
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error al consultar la API de DEV.to: ${response.status} ${response.statusText}`);
    }
    const devToArticles: any[] = await response.json();
    
    // Mapeamos los datos recibidos a nuestro formato de tipo 'Article'
    const articles = devToArticles.map((art: any) => {
      // Determinamos una categoría basada en la primera etiqueta, o 'Tecnología' por defecto
      const firstTag = art.tag_list && art.tag_list[0];
      const category = firstTag 
        ? firstTag.charAt(0).toUpperCase() + firstTag.slice(1) 
        : 'Tecnología';

      // Formateamos la fecha a un formato legible en español (ej: "12 de junio de 2026")
      const date = new Date(art.published_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Mapeamos a la interfaz que espera el componente BlogRenderComponent
      return {
        id: art.id.toString(),
        title: art.title,
        category,
        tags: art.tag_list || [],
        coverImage: art.cover_image || art.social_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
        date,
        author: {
          name: art.user.name,
          avatar: art.user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(art.user.name)}`
        },
        likes: art.public_reactions_count || 0,
        commentsCount: art.comments_count || 0,
        shares: Math.floor((art.public_reactions_count || 0) * 0.8), // Simulación de compartidos
        blocks: [], // Se cargan en el detalle por ID
        comments: [] // Se cargan en el detalle por ID
      };
    });

    return articles;
  } catch (error: any) {
    console.error('Error en GET /api/articles:', error);
    return {
      error: true,
      message: error.message || 'Error interno del servidor'
    };
  }
});
