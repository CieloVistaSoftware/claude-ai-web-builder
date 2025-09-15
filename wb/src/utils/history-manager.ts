import { BuilderState, HistoryEntry } from '@/types';

/**
 * Manages undo/redo functionality for the website builder
 */
export class HistoryManager {
  private history: HistoryEntry[] = [];
  private currentIndex = -1;
  private maxEntries: number;

  constructor(maxEntries = 50) {
    this.maxEntries = maxEntries;
  }

  /**
   * Save current state to history
   */
  public saveState(state: BuilderState, action: string, description: string): void {
    // Remove any entries after current index (when undoing then making new changes)
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    const entry: HistoryEntry = {
      id: this.generateId(),
      action,
      timestamp: Date.now(),
      beforeState: this.deepClone(state),
      afterState: this.deepClone(state),
      description
    };

    this.history.push(entry);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxEntries) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Undo to previous state
   */
  public undo(): Partial<BuilderState> | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const entry = this.history[this.currentIndex];
      return entry ? entry.beforeState : null;
    }
    return null;
  }

  /**
   * Redo to next state
   */
  public redo(): Partial<BuilderState> | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const entry = this.history[this.currentIndex];
      return entry ? entry.afterState : null;
    }
    return null;
  }

  /**
   * Check if undo is available
   */
  public canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is available
   */
  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get current history entry
   */
  public getCurrentEntry(): HistoryEntry | null {
    return this.history[this.currentIndex] || null;
  }

  /**
   * Get all history entries
   */
  public getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  /**
   * Clear history
   */
  public clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get history statistics
   */
  public getStats(): { total: number; current: number; canUndo: boolean; canRedo: boolean } {
    return {
      total: this.history.length,
      current: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }

  private generateId(): string {
    return `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const clonedObj = {} as { [key: string]: unknown };
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj as T;
    }

    return obj;
  }
}