import { useCallback, useEffect, useReducer, useRef } from 'react'

interface FetchState<T> {
  isLoading: boolean
  data: T | null
  success: boolean
  errorMessage?: unknown | undefined
  isFetching: boolean
}

type FetchAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; message: unknown }
  | { type: 'RESET'; initialData: FetchState<T> }

const fetchReducer = <T>(
  state: FetchState<T>,
  action: FetchAction<T>
): FetchState<T> => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        isLoading: true,
        isFetching: true,
        data: state.data,
        success: false,
      }
    case 'FETCH_SUCCESS':
      if (
        state.data !== null &&
        JSON.stringify(state.data) === JSON.stringify(action.payload)
      ) {
        return {
          data: state.data,
          isLoading: false,
          success: true,
          isFetching: false,
        }
      }
      return {
        data: action.payload,
        isLoading: false,
        success: true,
        isFetching: false,
      }
    case 'FETCH_ERROR':
      return {
        isLoading: false,
        data: null,
        success: false,
        errorMessage: action.message,
        isFetching: false,
      }
    case 'RESET':
      return action.initialData || state

    default:
      return state
  }
}

interface useFetchProps<TResponse> {
  queryFn: (opts: { signal?: AbortSignal }) => Promise<TResponse>
  isEnabled?: boolean
  queryKey: unknown[]
}

export const useFetch = <TResponse>({
  queryFn,
  isEnabled,
  queryKey = [],
}: useFetchProps<TResponse>) => {
  const initialData = {
    isLoading: true,
    data: null,
    success: false,
    isFetching: false,
  }

  const [state, dispatch] = useReducer(
    fetchReducer as React.Reducer<
      FetchState<TResponse>,
      FetchAction<TResponse>
    >,
    initialData
  )

  const fnRef = useRef(queryFn)
  fnRef.current = queryFn

  const runQuery = useCallback(async () => {
    const controller = new AbortController()
    try {
      dispatch({ type: 'FETCH_START' })
      const response = await fnRef.current({ signal: controller.signal })
      dispatch({ type: 'FETCH_SUCCESS', payload: response })
    } catch (error: any) {
      if (error?.name !== 'AbortCleaning') {
        dispatch({ type: 'FETCH_ERROR', message: error?.message })
      }
    }
  }, [])

  useEffect(() => {
    if (typeof isEnabled !== 'undefined' && !isEnabled) return
    const controller = new AbortController()
    async function run() {
      try {
        dispatch({ type: 'FETCH_START' })
        const result = await fnRef.current({ signal: controller.signal })
        dispatch({ type: 'FETCH_SUCCESS', payload: result })
      } catch (error: any) {
        if (error?.name !== 'AbortCleaning') {
          console.error(error)
          dispatch({ type: 'FETCH_ERROR', message: error?.message })
        }
      }
    }

    run().catch(console.error)

    return () => {
      controller.abort(new DOMException('cleaning', 'AbortCleaning'))
    }
  }, [isEnabled, ...queryKey])

  const reset = useCallback(() => dispatch({ type: 'RESET', initialData }), [])

  return {
    data: state.data,
    isLoading: state.isLoading,
    runQuery,
    success: state.success,
    errorMessage: state.errorMessage,
    isFetching: state.isFetching,
    clearQuery: reset,
  }
}
