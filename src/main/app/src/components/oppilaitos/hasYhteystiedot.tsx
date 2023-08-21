import { isEmpty } from 'lodash';

import { Props } from './Yhteystiedot';

export const hasYhteystiedot = (props: Props = {} as any) =>
  (props.yhteystiedot && props.yhteystiedot?.length > 0) ||
  !isEmpty(props.hakijapalveluidenYhteystiedot);
