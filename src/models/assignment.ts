import { ClassItem } from "./classes";
import { ReaderItem } from "./reader";
import { Rating, StudentItem } from "./student";

export type AssignmentKeys =
  | "id"
  | "class_id"
  | "title"
  | "start_time"
  | "end_time"
  | "book_id"
  | "message";

export interface AssignmentItem {
  readonly id?: string;
  class_id?: string;
  class?: ClassItem;
  title?: string;
  start_time?: string;
  end_time?: string;
  book_id?: string;
  message?: string;
  book?: ReaderItem;
  history?: AssignmentHistory[];
}

export interface ErrorItem {
  msg: string;
  item: AssignmentKeys;
}

export type AssignmentHistory = {
  chapter: number;
  chapter_last: number;
  score?: number;
  read_time: string;
  start_time: string;
  last_time: string;
  allow_retake?: boolean | null;
  request_retake?: string | null;
  rating: Rating;
  student: StudentItem;
};
