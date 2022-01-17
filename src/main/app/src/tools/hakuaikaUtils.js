import { isBefore, subMonths } from 'date-fns';

export const isHakuAuki = (hakuajat = []) =>
  hakuajat.some((hakuaika) => hakuaika['haku-auki']);

// 3 kk sitten päättyneet tai uudemmat ovat relevantteja oppijalle
export const isHakuTimeRelevant = (hakuajat) => {
  const now = new Date();
  return hakuajat.some(
    (aika) => !aika.paattyy || isBefore(subMonths(now, 3), new Date(aika.paattyy))
  );
};
