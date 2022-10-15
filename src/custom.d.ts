declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.less' {
  const resource: {[key: string]: string};
  export = resource;
}
