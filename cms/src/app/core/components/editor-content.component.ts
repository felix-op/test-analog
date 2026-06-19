import {
  Component,
  afterNextRender,
  input,
  OnDestroy,
} from '@angular/core';
import type { Block } from '@models/block.model';

@Component({
  selector: 'app-editor-content',
  template: `
    <div
      class="bg-white border border-slate-200 rounded-2xl min-h-64 shadow-sm"
    >
      <div [id]="holderId" class="px-6 py-4 prose max-w-none text-slate-700"></div>
    </div>
  `,
})
export class EditorContentComponent implements OnDestroy {
  readonly holderId = 'editorjs-holder';
  readonly initialBlocks = input<Block[]>([]);

  private editorInstance: any = null;

  constructor() {
    afterNextRender(async () => {
      const { default: EditorJS } = await import('@editorjs/editorjs');
      const { default: Header } = await import('@editorjs/header');
      const { default: List } = await import('@editorjs/list');

      this.editorInstance = new EditorJS({
        holder: this.holderId,
        data: { blocks: this.initialBlocks() },
        tools: {
          header: { class: Header as any, inlineToolbar: true },
          list: { class: List as any, inlineToolbar: true },
        },
        placeholder: 'Haz clic aquí para escribir el contenido del artículo…',
      });
    });
  }

  async getBlocks(): Promise<Block[]> {
    if (!this.editorInstance) return [];
    const output = await this.editorInstance.save();
    return output.blocks as Block[];
  }

  ngOnDestroy() {
    this.editorInstance?.destroy?.();
  }
}
