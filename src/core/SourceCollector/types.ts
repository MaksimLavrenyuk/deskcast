export type Source = {
  id: string,
  name: string
};

export interface SourceCollector {
  sources(): Promise<Source[]>
}
