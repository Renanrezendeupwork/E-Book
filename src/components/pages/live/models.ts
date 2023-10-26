export type PollType = {
  id: string;
  question: string;
  total_votes: number;
  options: PollOption[];
};

export type PollOption = {
  id: string;
  option: string;
  votes: number;
  percentage: number;
};

export type QA_CommentType = {
  question: string;
  time: string;
};

export type prevVideoType = {
  to: string;
  image: string;
  title: string;
  date: string;
};
