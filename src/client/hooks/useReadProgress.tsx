import { LOCAL_STORAGE_KEYS } from "../consts/local-storage.ts";
import { useLocalStorage } from "./useLocalStorage.ts";

interface ChapterReadProgress {
  id: number;
  title: string;
  updatedAt: string;
}

interface NovelReadProgress {
  chapters_read: ChapterReadProgress[],
  updatedAt: string
}

type ReadProgress = Record<string, NovelReadProgress>

interface UpdateHistoryProps {
  novelTitle: string;
  chapter: Omit<ChapterReadProgress, 'updatedAt'>
}

interface IsReadProps {
  novelTitle: string;
  chapterId: number;
  chapterTitle: string;
}

export const useReadProgress = () => {
  const [history, setHistory] = useLocalStorage<ReadProgress>(
    LOCAL_STORAGE_KEYS.novelReadProgress,
    {}
  )

  const getLatestHistory = (): ReadProgress => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.novelReadProgress);
    return raw ? JSON.parse(raw) : {};
  };

  const updateHistory = ({ novelTitle: title, chapter }: UpdateHistoryProps) => {
    const isHistory = history[title];
    if (!isHistory) {
      const now = new Date()
      setHistory(oldHistories => ({
        ...oldHistories,
        [title]: {
          updatedAt: now.toISOString(),
          chapters_read: [{
            ...chapter,
            updatedAt: now.toISOString()
          }]
        },
      }));
      return;
    }

    const isChapterRead = isHistory.chapters_read.find(
      ch => ch.title === chapter.title && ch.id === ch.id
    )

    if (!isChapterRead) {
      const now = new Date()
      setHistory(oldHistories => ({
        ...oldHistories,
        [title]: {
          chapters_read: [...isHistory.chapters_read, {
            ...chapter,
            updatedAt: now.toISOString()
          }],
          updatedAt: now.toISOString()
        }
      }))
    }
  }

  const isRead = ({ novelTitle, chapterId, chapterTitle }: IsReadProps) => {
    const storage = getLatestHistory()
    const isHistory = storage[novelTitle];
    if (!isHistory) return false;

    const isChapterRead = isHistory.chapters_read.find(
      ch => ch.title === chapterTitle && ch.id === chapterId
    )

    return !!isChapterRead;
  }

  return {
    updateHistory,
    isRead
  }
}