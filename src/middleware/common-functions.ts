import { FilterFun } from "../models/filters";
import { CatItem } from "../models/reader";

export function isNumber(num: string | number | boolean): boolean {
  if (num === false || num === true) return false;
  const reg = /^\d+$/;
  if (typeof num == "number") return true;
  return reg.test(num);
}

export function validateEmail(email: string): boolean {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const response = re.test(String(email).toLowerCase());
  return response;
}

export function validatePassword(password: string): boolean {
  if (password.length < 6) return false;
  return true;
}

export function smartRedirect(page: string): string | false {
  const no_redirect = [
    "bookdetails",
    "editprofile",
    "reader",
    "student",
    "students",
    "books",
    "new_assignment",
    "assignment",
    "general",
    "rate",
    "library",
    "grades",
    "settings",
  ];
  if (no_redirect.indexOf(page) >= 0) {
    return false;
  }
  switch (page) {
    case "home":
      return `/`;
    case "spanish":
      return `/library/spanish`;
    case "french":
      return `/library/french`;
    case "german":
      return `/library/german`;

    default:
      return `/${page}`;
  }
}

export function useQueryParams(url: Location) {
  return new URLSearchParams(url.search);
}

export function getUserImage(url: string): string {
  const routes = ["cdn", "assets"];
  const cdn_url = process.env.REACT_APP_IMAGES_URL;
  const assets_url = process.env.REACT_APP_CDN_URL;

  const type = routes.find((rute) => url.search(rute));
  switch (type) {
    case "cdn":
      return `${cdn_url}/${url}`;
    case "assets":
      return `${assets_url}/${url}`;
    default:
      return `${assets_url}/${url}`;
  }
}

export const filterOptions: FilterFun = (options) => {
  return (query) => {
    const response = options.filter(
      (item) =>
        item.name.toLocaleLowerCase().search(query.toLocaleLowerCase()) >= 0
    );
    return response;
  };
};

export function renderBuyText(categories: CatItem[]) {
  let buy_text = "Need a Class Set of Paperbacks?";
  categories.forEach((cat) => {
    if (cat.buy_text) {
      buy_text = cat.buy_text;
    }
  });
  return buy_text;
}

export function mins_to_hours(mins: number) {
  if (mins < 1) {
    return "0:00";
  }
  const num = mins;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours}h:${rminutes}m`;
}
