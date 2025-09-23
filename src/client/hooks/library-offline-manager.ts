import { useState } from "react"
import { NovelsRepository, type NovelType } from "../infra/repository/novels-repository.ts";
import { DatabaseIdb } from "../infra/database.ts";

type RSuccess<T> = {
  success: true,
  data: T
}

type RError = {
  success: false,
  error: {
    message: string
  }
}

const ResponseSuccess = <T>(data: T): RSuccess<T> => {
  return {
    success: true,
    data: data
  }
}

const ResponseError = (message: string): RError => {
  return {
    success: false,
    error: {
      message: message
    }
  }
}


export const useBrowserLibraryManager = () => {
  const [repository] = useState(() => new NovelsRepository(DatabaseIdb))

  const addBook = async (novel: NovelType) => {
    try {
      await repository.add(novel);
      return ResponseSuccess(null)
    } catch (error: any) {
      return ResponseError(error?.message)
    }
  };

  const findBooks = async (orderByRecent: boolean = false) => {
    try {
      const result = await repository.find({ orderByMostRecent: orderByRecent })
      return ResponseSuccess(result)
    } catch (error: any) {
      return ResponseError(error?.message)
    }
  };

  const findOneBook = async (title: string) => {
    try {
      const result = await repository.findOne(title);
      return ResponseSuccess(result)
    } catch (error: any) {
      return ResponseError(error?.message)
    }
  }

  const getStorageEstimate = async () => {
    try {
      const result = await repository.getStorageEstimate()
      return ResponseSuccess(result)
    } catch (error: any) {
      return ResponseError(error?.message)
    }
  }

  const removeBook = async (title: string) => {
    try {
      await repository.delete(title);
      return ResponseSuccess(null)
    } catch (error: any) {
      return ResponseError(error?.message)
    }
  }

  return {
    addBook, findBooks, findOneBook, removeBook, getStorageEstimate
  }
}