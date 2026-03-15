/**
 * CSS Modules 타입 선언
 * *.module.css import 시 클래스명 객체 타입 제공
 */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
