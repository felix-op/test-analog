import { Component, afterNextRender, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Escribir Artículo</h1>
      
      <!-- Contenedor del Editor.js -->
      <div id="editorjs" class="border rounded-md p-4 min-h-[300px]"></div>

      <button 
        (click)="guardar()" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Guardar Artículo
      </button>

      <!-- Solo para visualizar lo que genera Editor.js -->
      @if (savedData()) {
        <div class="mt-8 p-4 bg-gray-100 text-gray-800 rounded">
          <h3 class="font-bold mb-2">JSON Generado (Listo para guardar en BD):</h3>
          <pre class="text-xs overflow-x-auto">{{ savedData() | json }}</pre>
        </div>
      }
    </div>
  `
})
export class BlogEditorComponent {
  editor!: EditorJS;
  savedData = signal<any>(null);

  constructor() {
    // Inicializamos Editor.js solo en el navegador (no en el servidor/SSR)
    afterNextRender(() => {
      this.editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          image: {
            class: ImageTool,
            config: {
              // Simulamos la subida de imágenes convirtiéndolas a Base64
              // En un proyecto real, configurarías 'endpoints: { byFile: 'URL_DE_TU_API' }'
              uploader: {
                uploadByFile(file: File) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      resolve({
                        success: 1,
                        file: {
                          url: e.target?.result // URL en Base64
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                },
                uploadByUrl(url: string) {
                  return new Promise((resolve) => {
                    resolve({
                      success: 1,
                      file: { url }
                    });
                  });
                }
              }
            }
          }
        },
        placeholder: 'Escribe tu historia aquí... (Presiona Tab para abrir el menú de bloques)'
      });
    });
  }

  async guardar() {
    try {
      const outputData = await this.editor.save();
      console.log('Datos guardados: ', outputData);
      this.savedData.set(outputData);
    } catch (error) {
      console.error('Error al guardar: ', error);
    }
  }
}