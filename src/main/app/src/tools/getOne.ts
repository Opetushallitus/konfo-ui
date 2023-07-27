export function getOne<T extends Record<string, T[keyof T]>>(entry: T) {
  return Object.values<T[keyof T]>(entry)?.[0];
}
