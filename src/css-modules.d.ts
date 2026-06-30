// Ambient typing for CSS Module imports (`import styles from './X.module.css'`).
// Storybook's Vite builder injects scoped styles; tsup/tsc needs this to type the
// default export as a class-name map.
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
