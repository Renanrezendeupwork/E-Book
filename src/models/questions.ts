export interface ChapterQuestion {
  id: string;
  chapter: string;
  question: string;
  response: string | null;
  correct: boolean | null;
  success_meme?: string;
  success_msg?: string;
  fail_msg?: string;
  fail_meme?: string;
  updated?: string;
  timestamp?: string;
  requested_retake: boolean;
  tries?: number;
  options: QuestionOptions[];
}

export interface QuestionOptions {
  id: string;
  question_id: string;
  option_txt: string;
  accepted: boolean;
}

type quizResponses = {
  correct?: boolean | null;
};
export type Userquiz = {
  chapter: string;
  responses?: quizResponses[];
  updated?: string;
  timestamp?: string;
  requested_retake: boolean;
};

export type DB_affirmations = {
  affirmations: Affirmation[];
};

export type Affirmation = {
  id: string;
  message: string;
  type: "correct" | "incorrect";
};

export type Affirmationtype = {
  correct: Affirmation;
  incorrect: Affirmation;
};
