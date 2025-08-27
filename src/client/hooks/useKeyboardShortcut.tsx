import { useCallback, useEffect } from "react";


type OptionalConfig = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey'>

interface ShortcutConfig extends Partial<OptionalConfig> {
  code: KeyboardEvent['code'];
  shortcutTarget?: HTMLElement
}

type Action = (e: KeyboardEvent) => void;

const useKeyboardShortcut = (action: Action, config: ShortcutConfig) => {
  const targetElement = config.shortcutTarget || document;

  const eventHandle = useCallback((e: KeyboardEvent) => {
    const { code, ctrlKey, altKey, shiftKey } = e;
    if (config.code !== code) return;
    if (config.ctrlKey && !ctrlKey) return;
    if (config.shiftKey && !shiftKey) return;
    if (config.altKey && !altKey) return;

    action(e)
  }, [action, config])

  useEffect(() => {
    targetElement.addEventListener('keydown', eventHandle as EventListener);
    return () => {
      targetElement.removeEventListener('keydown', eventHandle as EventListener);
    }
  }, [targetElement, eventHandle])
}

export { useKeyboardShortcut }