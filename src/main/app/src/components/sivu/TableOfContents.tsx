import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { SmartLink } from '#/src/components/common/SmartLink';
import { styled } from '#/src/theme';

const StyledMarkdown = styled(Markdown)({
  position: 'sticky',
  top: '90px',
});

const StyledLink = styled(SmartLink)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '16px',
  lineHeight: '27px',
  paddingLeft: '21px',
  color: colors.brandGreen,
  borderLeftColor: colors.grey500,
  borderLeftWidth: '1px',
  borderLeftStyle: 'solid',
  display: 'block',
  paddingBottom: '15px',
  [`&:focus-visible`]: {
    outline: '1px solid black',
  },
});

const HeadingLevelToComponent = ({
  children,
  id,
}: React.PropsWithChildren<{ id: string }>) => {
  const { t } = useTranslation();
  const value = children;
  return (
    <StyledLink aria-label={t('ankkurilinkki') + ' ' + value} href={`#${id}`}>
      {value}
    </StyledLink>
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
