export interface ReaderItem {
  id: string;
  read_time: string;
  coming_soon: boolean;
  is_new?: boolean;
  chapters: number;
  disabled: boolean;
  glossary_less?: boolean | null;
  title: string;
  total_ratings: number;
  url: string;
  print_url?: string;
  vocab_url?: string;
  video_url?: string;
  keys_url?: string;
  guide_url?: string;
  level_id: string;
  rank: number;
  rating: number;
  score?: number;
  allow_retake?: boolean | null;
  rating_teachers: number;
  rating_students: number;
  image_ver: number;
  images: ReaderImages;
  description_short: string;
  release_date: string;
  level: Level;
  language: Language;
  categories: [CatItem];
  glossary: string;
  glossary_arr: GlossaryItem[];
  nav_colors: NavColors;
  has_prereading: boolean;
  has_glossary: boolean;
  has_introduction: boolean;
  has_aboutstory: boolean;
  has_cultural: boolean;
  user_chapter?: number;
  chapter_questions?: number;
}

export interface ReaderImages {
  cover: string;
  thumb: string;
  poster: string;
}

export interface CatItem {
  name: string;
  buy_text: string;
  is_level: boolean;
  books_num: number;
  is_trending: boolean;
  id: string;
}

export interface Level {
  name: string;
  id: string;
}

export interface Language {
  name: string;
  id: string;
  active: boolean;
}

export interface NavColors {
  background: string;
  color: string;
}

export interface RateDataType {
  selected: number;
  hovered: number;
  message?: string;
  error?: string;
}
export type GlossaryItem = {
  es: string;
  en: string;
};
