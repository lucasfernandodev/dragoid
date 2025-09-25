import S from './style.module.css';
import { createPortal } from 'react-dom';
import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement } from 'react';



interface TripleClicksHook {
  target: {
    current: HTMLElement | null
  }
  type: 'dock' | 'bar',
  onTipleClick: () => void;
  onTripleClickTimeout: () => void
}

const useTripleClicks = ({
  onTipleClick,
  onTripleClickTimeout,
  target,
  type
}: TripleClicksHook) => {
  useEffect(() => {

    const surface = target.current;
    if (!surface || type !== 'bar') return;

    let clicks_count = 0;
    let timer: string | number | NodeJS.Timeout | null | undefined = null;
    let click_threshold = 450;
    let menu_visible_duration = 3500;
    let isMenuVisible = false;

    const onTripleClicks = (e: PointerEvent) => {
      if (isMenuVisible) return;
      clicks_count++;

      if (clicks_count === 1) {
        timer = setTimeout(() => clicks_count = 0, click_threshold);
      }

      if (clicks_count === 3) {
        console.log('tiple click')
        clearTimeout(timer as number)
        clicks_count = 0;
        onTipleClick()
        isMenuVisible = true
        setTimeout(() => {
          isMenuVisible = false;
          onTripleClickTimeout()
        }, menu_visible_duration)
      }
    }

    surface.addEventListener('pointerdown', onTripleClicks)

    return () => {
      const surface = target.current;
      if (!surface) return;
      surface.removeEventListener('pointerdown', onTripleClicks)
      clicks_count = 0;
      clearTimeout(timer as number)
    }
  }, [target.current, type])
}

interface UseSetPosition {
  target: {
    current: HTMLElement | null
  }
  floatMenuRef: {
    current: HTMLElement | null
  }
}

const useSetPosition = ({ target, floatMenuRef }: UseSetPosition) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [type, setType] = useState<'dock' | 'bar'>('dock');

  useEffect(() => {
    const changePosition = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const el = target.current;
      const floatMenu = floatMenuRef.current;
      if (!el || !floatMenu) return;
      const { top, left, width } = el.getBoundingClientRect();

      const nX = left + width + 16
      const nY = top < 0 ? 120 : top + 120;

      const {
        width: floatMenuWidth,
        height: floatMenuHeight
      } = floatMenu.getBoundingClientRect()

      if (nX + floatMenuWidth > vw) {
        setType('bar')
      } else {
        setType('dock')
      }


      setPosition(() => ({
        x: nX,
        y: nY
      }))
    }


    changePosition();

    window.addEventListener('resize', changePosition)

    return () => {
      window.removeEventListener('resize', changePosition)
    }
  }, [target])

  return {
    position, type
  }
}

interface FloatMenuProps {
  target: {
    current: HTMLElement | null
  },
  children: React.ReactNode
}

// Main
export const FloatMenu = ({ target, children }: FloatMenuProps) => {

  const [isBarHidden, setIsBarHidden] = useState(true)
  const floatMenuRef = useRef<HTMLDivElement>(null);

  const { position, type } = useSetPosition({ floatMenuRef, target })

  useTripleClicks({
    onTipleClick: () => setIsBarHidden(old => !old),
    onTripleClickTimeout: () => setIsBarHidden(true),
    target: target,
    type: type
  })

  const childrenWithProps = Children.map(children, child => {
    // Verifica se o child é um elemento React válido antes de clonar
    if (isValidElement(child)) {
      // Clona o elemento e adiciona a prop 'data-type'
      return cloneElement(child as ReactElement<any>, { 'data-type': type });
    }
    // Se não for um elemento válido (ex: um texto), retorna como está
    return child;
  });

  return createPortal(
    <div
      className={S.float_menu}
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        opacity: position.x !== 0 && position.y !== 0 ? '1' : '0',
      }}
      data-type={type}
      data-bar-hidden={isBarHidden}
      ref={floatMenuRef}
    >
      {childrenWithProps}
    </div >,
    document.body
  )
}