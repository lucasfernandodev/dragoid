import S from './style.module.css';
import type { ComponentProps } from "react"
import type { FC } from "../../../types/fc.ts"
import { cn } from "../../../utils/cn.ts"
import { Slot } from "@radix-ui/react-slot";

interface Props extends ComponentProps<'button'> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary'
}

export const Button: FC<Props> = ({ asChild, variant = 'primary', ...props }) => {
  const className = cn(S.button, props.className);

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...props}
      className={className}
      data-variant={variant}
    >
      {props.children}
    </Comp>
  )
}