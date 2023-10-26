export type PageSettingItem = {
  id: string;
  type: string;
  description: string;
};

export type SettingPage = {
  name: string;
  id: string;
  path: string;
  icon: string;
  teacher_only?: boolean;
};

export type Themes = "green_theme" | "dark_theme";
