declare module "*.svg" {
  const content: any;
  export default content;
}

export interface InfoRowI {
  id: number;
  cards: InfoCardI[];
}

export interface InfoCardI {
  id: number;
  rowId: number;
  title: string;
  contentType: string;
  contentIFrameURL?: string;
  contentHTML?: string;
}
