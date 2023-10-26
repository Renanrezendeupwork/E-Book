import { Themes } from "./pageSettings";

export interface UserItem {
  id: string;
  token: string;
  name: string;
  profile_pic: string;
  plan?: PlanItem;
  email: string;
  lang_id: string;
  lang_name?: string;
  created_at: string;
  class_id?: string;
  is_teacher: boolean;
  admin?: boolean;
  active: boolean;
  login_code?: string;
  student_limit?: number;
  last_login?: string | null;
  teacher_id?: string;
  show_steps?: boolean;
  first_visit?: boolean;
  settings: UserSettings;
}

export interface UserEditItem {
  id: string;
  token: string;
  name: string;
  profile_pic: string;
  plan: PlanItem;
  email: string;
  lang_id: string;
  created_at: string;
  class_id?: string;
  is_teacher: boolean;
  login_code?: string;
  last_login?: string | null;
  password?: string | null;
  new_password?: string | null;
  new_password_reenter?: string | null;
  old_password?: string | null;
  new_email?: string | null;
  main_contact?: string | null;
}

export interface PlanItem {
  id: string;
  plan_id: string;
  price_amount: number;
  paid_amount: number;
  students: number;
  from: string;
  to: string;
  subtitle: string;
  days: number;
  status: boolean;
  payment_method: string;
  name: string;
}

export type UserSettings = {
  angelos_show: boolean;
  time_zone: string;
  hide_achievements?: boolean;
  block_password_change?: boolean;
  hide_quizzes?: boolean;
  allow_retakes?: boolean;
  theme: Themes;
};

export type NotiSettings = {
  retakes?: boolean;
  achievements?: boolean;
  new_books?: boolean;
};
