export interface LocalStorable {}

export const RESULT_STORE_KEY = 'keskiarvotulos';
export const AVERAGE_STORE_KEY = 'keskiarvot';
export const KOULUAINE_STORE_KEY = 'kouluaineet';

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
