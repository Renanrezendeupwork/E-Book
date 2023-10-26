import { DateTime } from "luxon";
import { format } from "timeago.js";

export enum NumericType {
  Numeric = "numeric",
  Digit = "2-digit",
}
export enum StringType {
  Long = "long",
  Short = "short",
}

export type ConfigType = {
  year?: NumericType;
  month?: StringType;
  day?: NumericType;
  hour?: NumericType;
  minute?: NumericType;
  hour12?: boolean;
};

const dfault_config: ConfigType = {
  year: NumericType.Numeric,
  month: StringType.Short,
  day: NumericType.Numeric,
  hour: NumericType.Numeric,
  minute: NumericType.Numeric,
  hour12: true,
};

export function toDate(
  date: string | undefined | null | false,
  config?: ConfigType,
  type?: "time"
): string {
  if (date === false) {
    date = DateTime.now().toSQL();
  } else if (!date) return "-";
  const system_Date = new Date(date);

  ////if date has no time, return date as is
  if (
    system_Date.getHours() === 0 &&
    system_Date.getMinutes() === 0 &&
    system_Date.getSeconds() === 0
  ) {
    return new Date(date).toLocaleDateString("en", config || dfault_config);
  }
  const local_date = DateTime.fromSQL(date, { zone: "UTC" })
    .toLocal()
    .toString();
  if (type === "time") {
    return new Date(local_date).toLocaleTimeString(
      "en",
      config || dfault_config
    );
  }
  return new Date(local_date).toLocaleDateString("en", config || dfault_config);
}

export function timeAgo(date: string | undefined | false): string {
  if (date === false) {
    date = DateTime.now().toSQL();
  } else if (!date) return "-";
  return format(DateTime.fromSQL(date, { zone: "UTC" }).toLocal().toString());
}

export function getWeekDates(
  weekNumber: number,
  yearNumber?: number | false
): string {
  if (!yearNumber) {
    yearNumber = new Date().getFullYear();
  }
  const dt = DateTime.fromObject({
    weekYear: yearNumber,
    weekNumber: weekNumber,
  });

  const dateFromStr = dt.startOf("week");
  const dateToStr = dt.endOf("week");
  const inital_day = dateFromStr.toLocaleString({
    month: "short",
    day: "numeric",
  });
  const end_day = dateToStr.toLocaleString({ month: "short", day: "numeric" });
  return `${inital_day} - ${end_day}`;
}
