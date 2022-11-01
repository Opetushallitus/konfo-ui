export interface LocalStorable {}

export const LocalStorageUtil = {
  save: (key: string, obj: LocalStorable) => {
    localStorage.setItem(key, JSON.stringify(obj));
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  load: (key: string): LocalStorable | null => {
    const obj = localStorage.getItem(key);
    if (!obj) {
      return null;
    }
    return JSON.parse(obj);
  },
};
