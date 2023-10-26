import { ReaderItem } from "./reader";
import { StudentItem } from "./student";

export type Grades = {
  student: StudentItem;
  book: ReaderItem;
  grades: GradeItem[];
  overall: GradeItem;
};

export type GradeItem = {
  chapter: string;
  grade: number;
  past?: number;
  question_num: number;
  disabled: boolean;
  requested_retake: boolean;
};
