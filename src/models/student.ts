import { KeysOfType } from "./common";
import { ReaderItem } from "./reader";
import { UserItem } from "./user";

export type StudentItem = {
  id: string;
  token: string;
  teacher_id: string;
  name: string;
  first_name: string;
  last_name: string;
  login_code: string;
  class_id: string;
  last_login: string;
  created: string;
  lang_id: string;
  first_visit: boolean;
  minutes: string;
  semester_minutes: string;
  firebase_id?: string;
  password?: string;
  class: ClassGroup;
  history: HistoryItem[];
};

export type StudentFields = KeysOfType<StudentItem, string>;

export interface ClassGroup {
  id: string;
  teacher_id: string;
  name: string;
  students: number;
  created: string;
}

export interface HistoryItem {
  chapter: number;
  chapter_last: number;
  score?: number;
  read_time: string;
  start_time: string;
  last_time: string;
  allow_retake?: boolean | null;
  request_retake?: string | null;
  rating: Rating;
  book: ReaderItem;
}

export interface Rating {
  value: number;
  opinion: string;
  date: string;
}

export type StudentTransferItem = {
  id: number;
  name: string;
};
export type StudentsTransferType = {
  students: StudentTransferItem[];
  teacher: UserItem;
  type: "sent" | "received";
  students_count: number;
};
