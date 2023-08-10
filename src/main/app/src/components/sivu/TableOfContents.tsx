import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { SmartLink } from '../common/SmartLink';
const PREFIX = 'TableOfContents';

const classes = {
  link: `${PREFIX}-link`,
};

const StyledMarkdown = styled(Markdown)({
  position: 'sticky',
  top: '90px',
  [`& .${classes.link}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '16px',
    lineHeight: '27px',
    paddingLeft: '21px',
    color: colors.brandGreen,
    borderLeftColor: colors.lightGrey,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    display: 'block',
    paddingBottom: '15px',
  },
});

const HeadingLevelToComponent = ({
  children,
  id,
}: React.PropsWithChildren<{ id: string }>) => {
  const { t } = useTranslation();
  const value = children;
  return (
    <SmartLink
      className={classes.link}
      aria-label={t('ankkurilinkki') + ' ' + value}
      href={`#${id}`}>
      {value}
    </SmartLink>
  );
};

const Null = () => null;

export const TableOfContents = (props: { content?: string }) => {
  const { content } = props;
  return content ? (
    <StyledMarkdown
      options={{
        overrides: {
          img: {
            component: Null,
          },
          h1: {
            component: Null,
          },
          h2: {
            component: HeadingLevelToComponent,
          },
          h3: {
            component: Null,
          },
          h4: {
            component: Null,
          },
          p: {
            component: Null,
          },
          a: {
            component: Null,
          },
          ul: {
            component: Null,
          },
          ol: {
            component: Null,
          },
          details: {
            component: Null,
          },
          sivu: {
            component: Null,
          },
          br: {
            component: Null,
          },
          table: {
            component: Null,
          },
        },
      }}>
      {content}
    </StyledMarkdown>
  ) : null;
};
