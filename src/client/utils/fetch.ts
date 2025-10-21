interface FetchConfig extends Omit<RequestInit, 'signal'> {
  timeout?: number
  signal?: AbortSignal | AbortSignal[] | null | undefined
}

export const _fetch = async (url: string, config: FetchConfig = {}) => {
  const controller = new AbortController()
  let timeoutId: undefined | number

  const linkSignal = (externalSignal: AbortSignal) => {
    // Se o sinal externo já foi abortado, abortamos o nosso imediatamente.
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason)
      return
    }

    // CORREÇÃO PRINCIPAL: Ouvimos o evento 'abort' no sinal EXTERNO.
    externalSignal.addEventListener(
      'abort',
      () => {
        // E quando ele ocorre, abortamos o nosso controller INTERNO.
        controller.abort(externalSignal.reason)
      },
      {
        // Otimização: removemos este ouvinte automaticamente se o nosso
        // controller interno for abortado por outro motivo (ex: timeout).
        // Isso previne memory leaks.
        signal: controller.signal,
      }
    )
  }

  if (config.signal) {
    if (Array.isArray(config.signal)) {
      config.signal.forEach(linkSignal)
    } else {
      linkSignal(config.signal)
    }
  }

  timeoutId = window.setTimeout(
    () =>
      controller.abort(
        new DOMException(
          `signal timed out (${config?.timeout ?? 5000}ms)`,
          'TimeoutError'
        )
      ),
    config?.timeout ?? 5000
  )

  try {
    const response = await fetch(url, { ...config, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}
