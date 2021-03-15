export interface IDialogflowQueryResponse {
  status: string;
  intentResponse: string;
  chips: IDialogflowQueryResponseChip[] | null;
  cards: IDialogflowQueryResponseCard[] | null;
}

export interface IDialogflowQueryResponseChip {
  value: string;
  link: string;
}

export interface IDialogflowQueryResponseCard {
  title: string;
  subtitle: string;
  link: string;
  image: string;
}