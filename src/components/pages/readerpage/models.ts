import { ClassItem } from "../../../models/classes";
import { FilterFun, SelectSearchItem } from "../../../models/filters";
import { ChapterQuestion, Userquiz } from "../../../models/questions";
import { ReaderItem } from "../../../models/reader";
import { HistoryItem, StudentItem } from "../../../models/student";

export type BottomInfoProps = {
  questions: Userquiz[];
  students?: StudentItem[];
  student?: StudentItem;
  filterStudents?: any;
  refetch: () => void;
  loading: boolean;
  filter: FilterTypes;
  book_id: string;
  handleSelectClass: any;
  requestRetake: any;
  class_selected: ClassItem | null;
  filterOptions: FilterFun;
  classGroups: SelectSearchItem[];
  book_url: string;
};

export type DB_response = {
  book: ReaderItem;
  bookQuestions: ChapterQuestion[];
  students: StudentItem[];
  student: StudentItem;
  classes: ClassItem[];
};

export type BookReview = {
  book_id: string;
  user_id: string;
  is_teacher: boolean;
  rating: number;
  opinion: string;
  timestamp: string;
};

export type TabOptions = "quiz" | "reviews";

export type FilterTypes =
  | "passed"
  | "missing"
  | "failed"
  | "reload"
  | "requested"
  | "initial"
  | false;

export type QuizTableProps = {
  students: StudentItem[];
  filterStudents: any;
  filter: FilterTypes;
  refetch: () => void;
  book_id: string;
  handleSelectClass: any;
  class_selected: ClassItem | null;
  filterOptions: FilterFun;
  classGroups: SelectSearchItem[];
};

export type ResponseRowProps = {
  student: StudentItem;
  refetch: () => void;
  book_id: string;
};

export type RetakeRenderProps = {
  history?:
    | HistoryItem
    | { score: number; allow_retake: null; request_retake: null };
  student: StudentItem;
  refetch: () => void;
  disabled?: boolean;
  chapter?: string;
  book_id?: string;
  key?: number;
};

export type ListFiltersProps = { filterStudents: any; filter: FilterTypes };

export type ResponseTableProps = {
  refetch: () => void;
  questions: Userquiz[];
  student?: StudentItem;
  requestRetake?: any;
  allow_retake?: boolean;
  loading: boolean;
  book_url: string;
  book_id: string;
};
