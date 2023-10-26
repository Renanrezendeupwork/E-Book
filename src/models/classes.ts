export interface ClassItem {
  readonly value: string;
  txt: string;
  name: string;
  teacher_id: string;
  students: number;
  created: string;
}

export interface NewClassItem {
  txt?: string;
}
