declare module "*.svg" {
  const content: any;
  export default content;
}

interface EntityPageI {
  id: string | number;
  title?: string;
}
