export interface TableColumn<T> {
  header: string;
  colSpan?: number;
  className?: string;
  exportFields?: Map<string, string>;
  render: (item: T, index: number) => React.ReactNode;
}
