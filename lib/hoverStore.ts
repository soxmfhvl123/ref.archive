import { Reference } from './types';
import { getKeyColors } from './colors';

export interface HoverData {
  ref: Reference | null;
  colors: [string, string] | null;
}

type HoverListener = (data: HoverData) => void;

class HoverStore {
  private listeners: Set<HoverListener> = new Set();
  private currentRef: Reference | null = null;
  private currentColors: [string, string] | null = null;

  public subscribe(listener: HoverListener): () => void {
    this.listeners.add(listener);
    listener({ ref: this.currentRef, colors: this.currentColors });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setHovered(ref: Reference | null) {
    if (this.currentRef?.id === ref?.id) return;
    this.currentRef = ref;
    this.currentColors = ref ? getKeyColors(ref) : null;
    const data: HoverData = { ref: this.currentRef, colors: this.currentColors };
    this.listeners.forEach((listener) => listener(data));
  }

  public get(): HoverData {
    return { ref: this.currentRef, colors: this.currentColors };
  }
}

export const hoverStore = new HoverStore();
