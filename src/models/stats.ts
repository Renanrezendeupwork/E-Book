export type StatsItem = {
  name: string;
  value: number;
  id: string;
  icon: string;
  type: StatsItemType;
  class_id?: string;
};

export type StatsItemType =
  | "number"
  | "time"
  | "minutes"
  | "seconds"
  | "percentage"
  | "currency";
