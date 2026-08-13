// Allow importing CSS/SCSS as side-effect modules in TypeScript
declare module '*.scss';
declare module '*.css';
declare module '*.sass';
declare module '*.less';
declare module '*.svg' {
  const content: any;
  export default content;
}

// Explicitly allow bootstrap-icons CSS import
declare module 'bootstrap-icons/font/bootstrap-icons.css';
