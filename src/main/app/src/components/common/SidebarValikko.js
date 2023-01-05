import React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful, useSideMenu } from '#/src/hooks';

const PREFIX = 'SidebarValikko';

const classes = {
  root: `${PREFIX}-root`,
  valikko: `${PREFIX}-valikko`,
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
  color: colors.green,
  marginLeft: '20px',
  [`& .${classes.valikko}`]: {
    paddingTop: '0',
    paddingBottom: '0',
    borderTopStyle: 'solid',
    borderWidth: '1px',
    borderColor: colors.lightGrey,
    color: colors.darkGrey,
    '&:last-child': {
      borderBottomStyle: 'solid',
      marginBottom: '40px',
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
    borderColor: colors.lightGrey,
    padding: '12px',
  },
  [`& .${classes.valintaIcon}`]: {
    color: colors.brandGreen,
  },
});

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />;
};
const SivuItem = (props) => {
  const { name, id, onClick } = props;
  return (
    <ListItemLink role="none" onClick={() => onClick(id)} className={classes.valikko}>
      <ListItemText
        role="menuitem"
        className={classes.valintaText}
        tabIndex="0"
        aria-label={name}>
        {name}
      </ListItemText>
    </ListItemLink>
  );
};
const OtsikkoItem = (props) => {
  const { name } = props;
  return (
    <h2
      role="menuitem"
      className={classes.otsikkoText}
      variant="menu"
      typography="menu"
      tabIndex="0"
      aria-label={name}>
      {name}
    </h2>
  );
};
const ValikkoItem = (props) => {
  const { name, id, select } = props;
  return (
    <ListItemLink role="none" className={classes.valikko} onClick={() => select(id)}>
      <ListItemText
        className={classes.valintaText}
        role="menuitem"
        tabIndex="0"
        aria-label={name}>
        {name}
      </ListItemText>
      <ListItemIcon className={classes.valintaIconBase}>
        <ChevronRightIcon className={classes.valintaIcon} />
      </ListItemIcon>
    </ListItemLink>
  );
};
const SidebarValikko = (props) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { forwardTo } = useContentful();
  const { parent, select, deselect, closeMenu, name, id, links } = props;
  const { keepMenuVisible } = useSideMenu();

  const forwardToPage = (pageId) => {
    navigate(`/${i18n.language}${forwardTo(pageId)}`);
    if (!keepMenuVisible) {
      closeMenu();
    }
  };

  return (
    <StyledList className={classes.root} aria-label="contacts">
      {parent ? (
        <ListItemLink className={classes.parentOtsikko} role="none" onClick={deselect}>
          <ListItemIcon className={classes.parentOtsikkoIconBase}>
            <ChevronLeftIcon className={classes.parentOtsikkoIcon} />
          </ListItemIcon>
          <ListItemText role="menuitem" tabIndex="0" aria-label={parent.name}>
            {parent.name}
          </ListItemText>
        </ListItemLink>
      ) : null}
      <OtsikkoItem key={`otsikko-item-${name}`} name={name} id={id} />
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
  );
};

export default SidebarValikko;
