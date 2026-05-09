declare module 'katex/contrib/auto-render' {
  import type { KatexOptions } from 'katex';

  export interface RenderMathInElementOptions extends KatexOptions {
    delimiters?: ReadonlyArray<{ left: string; right: string; display: boolean }>;
    ignoredTags?: ReadonlyArray<string>;
    ignoredClasses?: string[];
    errorCallback?(msg: string, err: Error): void;
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: RenderMathInElementOptions,
  ): void;
}
