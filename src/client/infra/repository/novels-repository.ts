
import type { DatabaseType, TableNovelScheme } from "../database.ts"

export type NovelType = Omit<TableNovelScheme, 'createdAt'>

export class NovelsRepository {
  private db: DatabaseType;

  constructor(database: DatabaseType) {
    this.db = database;
  }

  private dispatchUpdateEvent = () => {
    const eventData = { message: 'Database update' };
    const customEventWithData = new CustomEvent('library-update', { detail: eventData });
    document.dispatchEvent(customEventWithData);
  }

  private createStore = async <T extends IDBTransactionMode>(actionType: T) => {
    const { novels } = await this.db()
    const tr = novels.transaction('novels', actionType);
    const store = tr.objectStore('novels')
    return { store, tr }
  }

  public add = async (novel: NovelType) => {
    const { store, tr } = await this.createStore('readwrite')
    await store.add({
      ...novel,
      createdAt: Date.now()
    })

    await tr.done;
    this.dispatchUpdateEvent()
  }

  public put = async (title: string, data: Partial<NovelType>) => {
    const { store, tr } = await this.createStore('readwrite');

    const response = await store.get(title);

    if (!response) {
      await tr.done;
      throw new Error('Novel not found')
    }

    const updatedData = {
      ...response,
      data
    }

    try {
      await store.put(updatedData)
      this.dispatchUpdateEvent()
    } finally {
      await tr.done
    }
  }

  public find = async (config: { orderByMostRecent: boolean } = { orderByMostRecent: false }) => {
    const { store, tr } = await this.createStore('readonly');
    if (config?.orderByMostRecent) {
      const queryByRecent = store.index('createdAt');
      try {
        const result = await queryByRecent.getAll()
        return result;
      } finally {
        await tr.done;
      }
    }

    try {
      const result = await store.getAll();
      return result;
    } finally {
      await tr.done
    }
  }

  public findOne = async (title: string) => {
    const { store, tr } = await this.createStore('readonly');

    try {
      const response = await store.get(title);
      return response;
    } finally {
      await tr.done
    }
  }

  public delete = async (title: string) => {
    const { store, tr } = await this.createStore('readwrite');

    const response = await store.get(title);

    if (!response) {
      await tr.done;
      throw new Error('Novel not found')
    }

    try {
      await store.delete(title)
      this.dispatchUpdateEvent()
    } finally {
      await tr.done
    }
  }

  public getStorageEstimate = async () => {
    const estimate = await navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const usage = estimate.usage || 0;

    const usagePercent = (usage / quota) * 100;
    const quotaSize = `${(quota / 1024 / 1024).toFixed(2)}MB`

    return {
      usagePercent,
      quotaSize
    }
  }
}