import { Sort } from '../enum/sort.enum';

export function arraySort<T>(items: T[], onKey: keyof T, sort: Sort) {
  const copy = [...items];
  copy.sort((a, b) => {
    if (a[onKey] < b[onKey]) {
      return -1;
    }
    if (a[onKey] > b[onKey]) {
      return 1;
    }
    return 0;
  });
  return sort === Sort.asc ? copy : copy.reverse();
}
