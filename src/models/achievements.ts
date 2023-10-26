import { StudentItem } from "./student";

export type Grade = "bronze" | "silver" | "gold" | "platinum";
export type AchievementUser = "both" | "teacher" | "student";

export type Achievement = {
  id: string;
  title: string;
  type_name: string;
  value: number;
  group: number;
  user_type: AchievementUser;
  teacher_id?: string;
  desc: string;
  success_msg: string;
  badge: string;
  badge_fade: string;
  points: number;
  grade: Grade;
  hidden: boolean;
  completed?: boolean;
  progress?: number;
  completed_at?: string;
};

export type Leaderboard = {
  is_teacher?: boolean;
  points: number;
  student: StudentItem;
};
