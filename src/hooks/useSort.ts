import { useState } from "react";

export type SortBy = {
  by: string;
  sort?: "desc" | "asc";
};

export type Options = {
  by: string;
  sort?: "desc" | "asc";
};

export function sortArray(
  data: any[],
  sort_by: string,
  sort?: "desc" | "asc"
): any[] {
  const levels = sort_by.split(".");
  if (levels.length === 1) {
    return data.sort((a, b) => {
      if (b[sort_by] === undefined) return -1;
      if (sort === "asc") {
        return a[sort_by].toLowerCase() > b[sort_by].toLowerCase() ||
          !a[sort_by]
          ? 1
          : -1;
      }
      return a[sort_by].toLowerCase() < b[sort_by].toLowerCase() || !a[sort_by]
        ? 1
        : -1;
    });
  }
  if (sort === "desc") {
    return data.sort((a, b) =>
      a[levels[0]][levels[1]] < b[levels[0]][levels[1]] ? 1 : -1
    );
  }
  return data.sort((a, b) =>
    a[levels[0]][levels[1]] > b[levels[0]][levels[1]] ? 1 : -1
  );
}

function useSort(options: Options): [SortBy, any] {
  const [sort_by, setSortBy] = useState<SortBy>({
    by: options.by,
    sort: options.sort,
  });
  const handleSort = (sort_by: SortBy) => {
    setSortBy({
      by: sort_by.by,
      sort: sort_by.sort,
    });
  };

  return [sort_by, handleSort];
}

export default useSort;
