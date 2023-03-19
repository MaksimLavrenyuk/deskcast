import { Source, SourceCollector } from './types';

export default class SourceCollectorMock implements SourceCollector {
  private readonly sourcesList: Source[];

  constructor(sources?: Source[]) {
    this.sourcesList = sources || [];
  }

  sources = async () => this.sourcesList;
}
