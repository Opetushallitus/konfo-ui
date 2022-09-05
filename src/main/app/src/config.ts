import { getConfiguration } from '#/src/api/konfoApi';
import { useQueryOnce } from '#/src/hooks';

export const useConfig: any = () => {
  const response = useQueryOnce('configuration', getConfiguration);
  return response.data;
};
