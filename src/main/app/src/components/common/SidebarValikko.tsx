import React from 'react';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSideMenu } from '#/src/hooks';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { ContentfulLink, ContentfulValikko } from '#/src/types/ContentfulTypes';

const PREFIX = 'SidebarValikko';

const classes = {
  root: `${PREFIX}-root`,
  valikko: `${PREFIX}-valikko`,
  valikkoItem: `${PREFIX}-valikkoItem`,
  otsikko: `${PREFIX}-otsikko`,
  parentOtsikko: `${PREFIX}-parentOtsikko`,
  parentOtsikkoIconBase: `${PREFIX}-parentOtsikkoIconBase`,
  parentOtsikkoIcon: `${PREFIX}-parentOtsikkoIcon`,
  otsikkoText: `${PREFIX}-otsikkoText`,
  valintaText: `${PREFIX}-valintaText`,
  valintaIconBase: `${PREFIX}-valintaIconBase`,
  valintaIcon: `${PREFIX}-valintaIcon`,
};

const StyledList = styled(List)({
  color: colors.brandGreen,
  marginLeft: '20px',
  [`& .${classes.valikko}`]: {
    paddingTop: '0',
    paddingBottom: '0',
    borderTopStyle: 'solid',
    borderWidth: '1px',
    borderColor: colors.grey500,
    color: colors.grey700,
    paddingRight: '0',
    '&:last-child': {
      borderBottomStyle: 'solid',
      marginBottom: '40px',
    },
  },
  [`& .${classes.valikkoItem}`]: {
    paddingTop: '0',
    paddingBottom: '0',
    alignItems: 'stretch',
    '&:hover': {
      backgroundColor: colors.grey50,
    },
    '&.Mui-selected': {
      backgroundColor: colors.grey50,
    },
  },
  [`& .${classes.otsikko}`]: {
    paddingTop: '0',
    paddingBottom: '0',
    color: colors.brandGreen,
  },
  [`& .${classes.parentOtsikko}`]: {
    paddingTop: '0',
    paddingBottom: '0',
  },
  [`& .${classes.parentOtsikkoIconBase}`]: {
    backgroundColor: colors.brandGreen,
    padding: '13px',
    marginRight: '10px',
  },
  [`& .${classes.parentOtsikkoIcon}`]: {
    color: colors.white,
  },
  [`& .${classes.otsikkoText}`]: {
    textTransform: 'uppercase',
    fontSize: '12px',
    color: colors.brandGreen,
  },
  [`& .${classes.valintaText}`]: {
    marginTop: '9px',
    marginBottom: '9px',
  },
  [`& .${classes.valintaIconBase}`]: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderColor: colors.grey500,
    padding: '12px',
    alignItems: 'center',
  },
  [`& .${classes.valintaIcon}`]: {
    color: colors.brandGreen,
  },
});

const ListItemLink = ({ className, ...props }: ListItemButtonProps) => {
  return (
    <ListItem disablePadding className={className}>
      <ListItemButton component="a" {...props} className={classes.valikkoItem} />
    </ListItem>
  );
};
const SivuItem = ({
  name,
  id,
  onClick,
}: {
  name: string;
  id: string;
  onClick: (id: string) => void;
}) => {
  return (
    <ListItemLink onClick={() => onClick(id)} className={classes.valikko}>
      <ListItemText className={classes.valintaText}>{name}</ListItemText>
    </ListItemLink>
  );
};

const OtsikkoItem = ({ name }: { name: string }) => {
  return (
    <li role="presentation">
      <h2 className={classes.otsikkoText}>{name}</h2>
    </li>
  );
};

const ValikkoItem = ({
  name,
  id,
  select,
}: {
  name: string;
  id: string;
  select: (id: string) => void;
}) => {
  return (
    <ListItemLink className={classes.valikko} onClick={() => select(id)}>
      <ListItemText className={classes.valintaText}>{name}</ListItemText>
      <ListItemIcon className={classes.valintaIconBase} aria-hidden="true">
        <MaterialIcon icon="chevron_right" className={classes.valintaIcon} />
      </ListItemIcon>
    </ListItemLink>
  );
};

export const SidebarValikko = (props: {
  parent?: ContentfulValikko;
  select: (id: string) => void;
  deselect: () => void;
  closeMenu: () => void;
  name: string;
  links: Array<ContentfulLink>;
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { forwardTo } = useContentful();
  const { parent, select, deselect, closeMenu, name, links } = props;
  const { keepMenuVisible } = useSideMenu();

  const forwardToPage = (pageId: string) => {
    navigate(`/${i18n.language}${forwardTo(pageId)}`);
    if (!keepMenuVisible) {
      closeMenu();
    }
  };

  return (
    <nav aria-label={name}>
      <StyledList className={classes.root}>
        {parent ? (
          <ListItemLink className={classes.parentOtsikko} onClick={deselect}>
            <ListItemIcon className={classes.parentOtsikkoIconBase}>
              <MaterialIcon icon="chevron_left" className={classes.parentOtsikkoIcon} />
            </ListItemIcon>
            <ListItemText>{parent.name}</ListItemText>
          </ListItemLink>
        ) : null}
        <OtsikkoItem key={`otsikko-item-${name}`} name={name} />
        {links.map((i) => {
          if (i.type === 'sivu') {
            return (
              <SivuItem
                key={`sivu-item-${i.name}`}
                name={i.name}
                id={i.id}
                onClick={forwardToPage}
              />
            );
          } else {
            return (
              <ValikkoItem
                key={`valikko-item-${i.name}`}
                name={i.name}
                id={i.id}
                select={select}
              />
            );
          }
        })}
      </StyledList>
    </nav>
  );
};
