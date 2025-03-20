export interface IColumns {
    field: string;
    header: string;
    colId?: string;
    type: string;
    style?: string;
    click?(data: any): void;
    icon?: string;
    color?: string;
    disable?: string;
    buttonLabel?: string;
    align?: string;
    filter?: string;
    opt?: any[];
    hideColumn? : boolean;
  }