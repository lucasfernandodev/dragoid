import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { IChapter, INovel } from '../components/templates/homepage/default/index.tsx';

export interface TableNovelScheme extends INovel {
  chapters: IChapter[];
  createdAt: number
}

interface NovelsTableType extends DBSchema {
  novels: {
    value: TableNovelScheme,
    key: string;
    indexes: Pick<TableNovelScheme, 'title' | 'createdAt'>
  };
}

export type NovelsTable = IDBPDatabase<NovelsTableType>

export type DatabaseType = () => Promise<{ novels: IDBPDatabase<NovelsTableType> }>

export const DatabaseIdb: DatabaseType = async () => {
  return {
    novels: await openDB<NovelsTableType>('novels', 1, {
      upgrade: db => {
        const objectStore = db.createObjectStore('novels', { keyPath: 'title', });
        objectStore.createIndex('createdAt', 'createdAt', { unique: true, })
        objectStore.transaction.oncomplete = () => {
          console.log('Table novels created!')
        }
      }
    })
  }
}