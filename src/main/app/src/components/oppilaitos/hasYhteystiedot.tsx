import { isEmpty } from 'lodash';

import { Props } from './Yhteystiedot';

export const hasYhteystiedot = (props: Props = {} as any) =>
  (props.yhteystiedot && !isEmpty(props.yhteystiedot)) ||
  !isEmpty(props.hakijapalveluidenYhteystiedot);
