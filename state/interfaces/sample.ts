export type CellTypes = 'code' | 'text';

export interface Sample {
  id: string;
  type: CellTypes;
  content: string;
}
