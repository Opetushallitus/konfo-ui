import { LanguageCode } from '#/src/types/common';

export type AnswerOptionType = {
  id: number;
  label: string | null;
  target: number | null;
};

export type TutuTranslation = {
  answers: Array<AnswerOptionType>;
  body?: string | null;
  name: string;
  question?: string | null;
};

export type TutuObject = {
  changed: number;
  created: number;
  id: number;
  is_frontpage: boolean;
  status: boolean;
  translations: Partial<Record<LanguageCode, TutuTranslation>>;
  uuid: string;
};
