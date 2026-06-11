import { Injectable, signal } from '@angular/core';
import { Article, Comment } from '../types/blog.type';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly STORAGE_KEY = 'blog_articles';
  
  private articlesSignal = signal<Article[]>([]);
  articles = this.articlesSignal.asReadonly();

  // Lista estática de categorías
  readonly categories = [
    'Nacional',
    'Política',
    'Negocios',
    'Tecnología',
    'Deportes',
    'Estilo de vida',
    'Viajes'
  ];

  constructor() {
    this.cargarArticulos();
  }

  private cargarArticulos() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.articlesSignal.set(JSON.parse(stored));
          return;
        } catch (e) {
          console.error('Error al parsear artículos guardados:', e);
        }
      }
      // Si no hay artículos, inicializar con datos semilla (mock)
      const mockArticles = this.obtenerDatosSemilla();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockArticles));
      this.articlesSignal.set(mockArticles);
    }
  }

  private guardarArticulos(articulos: Article[]) {
    this.articlesSignal.set(articulos);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articulos));
    }
  }

  obtenerArticuloPorId(id: string): Article | undefined {
    return this.articlesSignal().find(a => a.id === id);
  }

  guardarArticulo(articulo: Article) {
    const articulos = this.articlesSignal();
    const index = articulos.findIndex(a => a.id === articulo.id);
    let nuevosArticulos: Article[];

    if (index !== -1) {
      // Editar existente
      nuevosArticulos = [...articulos];
      // Preservar likes, comments y shares si no vienen definidos
      const existente = articulos[index];
      nuevosArticulos[index] = {
        ...existente,
        ...articulo,
        likes: articulo.likes ?? existente.likes,
        commentsCount: articulo.comments?.length ?? existente.commentsCount,
        shares: articulo.shares ?? existente.shares,
        comments: articulo.comments ?? existente.comments
      };
    } else {
      // Crear nuevo
      nuevosArticulos = [articulo, ...articulos];
    }

    this.guardarArticulos(nuevosArticulos);
  }

  eliminarArticulo(id: string) {
    const filtrados = this.articlesSignal().filter(a => a.id !== id);
    this.guardarArticulos(filtrados);
  }

  darMeGusta(id: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, likes: articulo.likes + 1 };
      }
      return articulo;
    });
    this.guardarArticulos(actualizados);
  }

  compartirArticulo(id: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, shares: articulo.shares + 1 };
      }
      return articulo;
    });
    this.guardarArticulos(actualizados);
  }

  agregarComentario(articuloId: string, autor: string, texto: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === articuloId) {
        const comentarios = articulo.comments || [];
        const nuevoComentario: Comment = {
          id: Date.now().toString(),
          author: autor,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(autor)}`,
          text: texto,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        const nuevosComentarios = [nuevoComentario, ...comentarios];
        return {
          ...articulo,
          comments: nuevosComentarios,
          commentsCount: nuevosComentarios.length
        };
      }
      return articulo;
    });
    this.guardarArticulos(actualizados);
  }

  obtenerArticulosRelacionados(articulo: Article, limite = 3): Article[] {
    return this.articlesSignal()
      .filter(a => a.id !== articulo.id) // Excluir el artículo actual
      .map(a => {
        // Calcular coincidencia
        let coincidencia = 0;
        if (a.category === articulo.category) coincidencia += 5;
        if (a.tags && articulo.tags) {
          const coincidenciasTags = a.tags.filter(t => articulo.tags?.includes(t)).length;
          coincidencia += coincidenciasTags * 2;
        }
        return { articulo: a, coincidencia };
      })
      .filter(item => item.coincidencia > 0)
      .sort((a, b) => b.coincidencia - a.coincidencia)
      .map(item => item.articulo)
      .slice(0, limite);
  }

  private obtenerDatosSemilla(): Article[] {
    return [
      {
        id: '1',
        title: 'Indonesia será sede de la Cumbre del Clima de la ASEAN 2025',
        category: 'Política',
        tags: ['ASEAN', 'Clima', 'Sostenibilidad', 'Política'],
        coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
        date: '24 de Junio de 2025',
        author: {
          name: 'Rina Wulandari',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina'
        },
        likes: 128,
        commentsCount: 2,
        shares: 960,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Yakarta, Indonesia –',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'Indonesia ha sido seleccionada oficialmente como el país anfitrión para la Cumbre del Clima de la ASEAN 2025, marcando un esfuerzo diplomático e internacional histórico. Esta será la primera vez que una nación del sudeste asiático lidere la cumbre con una agenda centrada enteramente en energías verdes y sostenibilidad.'
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'El anuncio fue realizado durante la Reunión Ministerial de la ASEAN en Kuala Lumpur el pasado fin de semana. La propuesta de Indonesia destacó por su ambicioso compromiso con las energías renovables, los programas de resiliencia climática y el desarrollo urbano sostenible.'
            }
          },
          {
            type: 'header',
            data: {
              text: 'Un Enfoque Regional en la Acción Climática',
              level: 3
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'La cumbre, programada para noviembre de 2025, reunirá a líderes y ministros de medio ambiente de las 10 naciones miembros de la ASEAN, junto con observadores invitados de la Unión Europea, Japón y Australia. Los temas de discusión clave incluirán la transición hacia energías limpias, el financiamiento para el desarrollo verde y la reducción del riesgo de desastres.'
            }
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Hoja de ruta para la transición de energía renovable en el sudeste asiático.',
                'Iniciativas de financiamiento climático transfronterizo.',
                'Sistemas comunitarios de alerta temprana ante desastres.'
              ]
            }
          },
          {
            type: 'image',
            data: {
              file: {
                url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60'
              },
              caption: 'Parque de aerogeneradores para la generación de energía limpia en la región.',
              withBorder: false,
              withBackground: false,
              stretched: false
            }
          }
        ],
        comments: [
          {
            id: 'c1',
            author: 'Juan Pérez',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Juan',
            text: 'Excelente iniciativa. Indonesia tiene un potencial enorme para liderar la transición energética en el sudeste asiático.',
            date: '25 de Junio de 2025'
          },
          {
            id: 'c2',
            author: 'Maria Gomez',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maria',
            text: 'Esperemos que los acuerdos se traduzcan en políticas reales y no solo en discursos diplomáticos.',
            date: '26 de Junio de 2025'
          }
        ]
      },
      {
        id: '2',
        title: 'Políticas de Energía Renovable: ASEAN debate la transición',
        category: 'Política',
        tags: ['Política', 'Energía', 'Clima'],
        coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
        date: '28 de Junio de 2025',
        author: {
          name: 'Budi Santoso',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi'
        },
        likes: 54,
        commentsCount: 1,
        shares: 42,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Estrategias de Descarbonización Regional',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'Los ministros de energía de la ASEAN debatieron ayer las nuevas directrices para acelerar la descarbonización. El plan incluye un subsidio conjunto para paneles solares y proyectos eólicos marinos en zonas costeras.'
            }
          }
        ],
        comments: [
          {
            id: 'c3',
            author: 'Carlos Ruiz',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Carlos',
            text: 'Muy necesario. La energía solar es clave en esta parte del mundo.',
            date: '29 de Junio de 2025'
          }
        ]
      },
      {
        id: '3',
        title: 'Yakarta implementará transporte verde para mitigar la polución',
        category: 'Tecnología',
        tags: ['Tecnología', 'Transporte', 'Clima', 'Urbanismo'],
        coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
        date: '02 de Julio de 2025',
        author: {
          name: 'Ahmad Hidayat',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad'
        },
        likes: 92,
        commentsCount: 0,
        shares: 112,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Electrificación Masiva del Transporte Público',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'El gobierno de la ciudad ha anunciado la compra de 500 autobuses eléctricos nuevos y la expansión de ciclovías protegidas. Este proyecto busca reducir en un 30% las emisiones contaminantes en el centro urbano para finales de 2026.'
            }
          }
        ]
      },
      {
        id: '4',
        title: 'Startups locales se unen a la agenda de innovación verde',
        category: 'Negocios',
        tags: ['Negocios', 'Startups', 'Innovación'],
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
        date: '05 de Julio de 2025',
        author: {
          name: 'Siti Aminah',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti'
        },
        likes: 73,
        commentsCount: 0,
        shares: 15,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'El auge de las CleanTechs',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'Las nuevas empresas tecnológicas dedicadas a la sostenibilidad están atrayendo inversiones récord. Desde bioplásticos hechos de algas hasta software de optimización energética para edificios industriales, el sector corporativo apuesta por la economía circular.'
            }
          }
        ]
      },
      {
        id: '5',
        title: 'Descubriendo los senderos del Parque Nacional Tierra del Fuego',
        category: 'Viajes',
        tags: ['Viajes', 'Naturaleza', 'Tierra del Fuego', 'Aventura'],
        coverImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=1000&auto=format&fit=crop&q=80',
        date: '10 de Julio de 2025',
        author: {
          name: 'Pablo Donato',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo'
        },
        likes: 215,
        commentsCount: 3,
        shares: 88,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'El Fin del Mundo a Pie',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'El Parque Nacional Tierra del Fuego ofrece algunos de los paisajes de senderismo más impresionantes de la Patagonia. Con senderos que bordean el Canal Beagle y cruzan bosques subantárticos de lengas y coihues, es una visita obligada para los amantes de la aventura.'
            }
          },
          {
            type: 'image',
            data: {
              file: {
                url: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&auto=format&fit=crop&q=60'
              },
              caption: 'Hermosa vista del lago enclavado en las montañas del fin del mundo.',
              withBorder: false,
              withBackground: false,
              stretched: false
            }
          }
        ],
        comments: [
          {
            id: 'c4',
            author: 'Enrique Torres',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Enrique',
            text: '¡Hermoso lugar! Estuve allí el verano pasado y la Senda Costera es de ensueño.',
            date: '11 de Julio de 2025'
          },
          {
            id: 'c5',
            author: 'Patricia Diaz',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Patricia',
            text: '¿Es necesario contratar un guía o los caminos están bien señalizados?',
            date: '12 de Julio de 2025'
          },
          {
            id: 'c6',
            author: 'Pablo Donato',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo',
            text: 'Patricia, los caminos principales están perfectamente señalizados y son auto-guiados. ¡Saludos!',
            date: '12 de Julio de 2025'
          }
        ]
      }
    ];
  }
}
