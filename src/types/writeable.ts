export type Writeable<T> = T extends object
  ? { -readonly [P in keyof T]: Writeable<T[P]> }
  : T;