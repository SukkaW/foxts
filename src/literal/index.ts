/**
 * Resolve mapped types and show the derived keys and their types when hovering in
 * VS Code, instead of just showing the names those mapped types are defined with.
 */
type DeepMutableWithPrettify<T> = {
  -readonly [P in keyof T]: DeepMutableWithPrettify<T[P]>;
} & {};

/**
 * When you are returning some object/array literal from a function,
 * TypeScript automatically widens the array to be more general, like
 * ['sukka'] becomes string[].
 *
 * TypeScript does this to allow returned arrays to be extensible,
 * but it may break the type inference.
 *
 * You can use `foxts/literal` to wrap your array to prevent TypeScript
 * from widening the type in function return values.
 *
 * Playground Link: https://www.typescriptlang.org/play/?declaration=false&jsx=0#code/C4TwDgpgBAIhFgLIFdgEMBGAbCB1AlsABYAKAThMMPgGYgA8AKgHxQC8UA3gFBRQC0FNABMA9gDssIKAG0SUfOKgBrCCFE0ojALoAuWPCSpMOAsXKVqdJnO3MA3NwC+UAGRcnjiAA8wossBQAMYSAM6BWIQQZGhY7FD0IeLhWswAFABu+owAlPpwCCjo2HiEpBRUtAws7KwZjtygkFAAyujAyKEA8hgAVhBBgRycUOFoHaH6AIJkMQwA5KLK81AAPlCLomCh86ye3DTI4oP4EsFEA8ppimCo+m3jnT39gzlcwWGiOAB0WKIA5tdxLdgG99twAPQQhSSRTQUR9AaBADu+CwcQw8OU3CCFyCVxGYwm+hki2W2igThyDShUARL0CNDIogAtlBDsdqGcKsgyEpUej2Wg0TiwoEMPE0m82Kw0oT2p0SWT5hSqY5cZc0hgpdTuJDoRhUFBiPhQnTxNABRisaLkoEgpLpbL5Y9JlBIsBorE0qSliqwbqNfi0kEdTToSazRJLWjrXTlAAaY2iUS2lLCR21d1RGJYOWjBVu33kymBvFXYRhoA
 */
export const literal = <const T extends object>(v: T): DeepMutableWithPrettify<T> => v;

literal({
  a: 1,
  b: {
    'c/d': 'trur'
  }
});

literal(['a']);
