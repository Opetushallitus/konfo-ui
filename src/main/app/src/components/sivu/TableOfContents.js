import React from 'react';

import { makeStyles } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { HashLink as Link } from 'react-router-hash-link';

import { colors } from '#/src/colors';
const useStyles = makeStyles({
  link: {
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

const TableOfContents = (props) => {
  const classes = useStyles();
  const { content } = props;
  const { t } = useTranslation();
  const HeadingLevelToComponent = ({ children, id }) => {
    const value = children;
    const anchor = id;
    return (
      <Link
        className={classes.link}
        aria-label={t('ankkurilinkki') + ' ' + value}
        to={`#${anchor}`}
        scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
        {value}
      </Link>
    );
  };
  const Null = () => null;
  return (
    <Markdown
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
        },
      }}>
      {content}
    </Markdown>
  );
};

export default TableOfContents;
