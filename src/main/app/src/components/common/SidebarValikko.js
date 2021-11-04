import React from 'react';

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useContentful, useSideMenu } from '#/src/hooks';

import { colors } from '../../colors';

const useStyles = makeStyles({
  root: {
    color: colors.green,
    marginLeft: '20px',
  },
  valikko: {
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
  otsikko: {
    paddingTop: '0',
    paddingBottom: '0',
    color: colors.brandGreen,
  },
  parentOtsikko: {
    paddingTop: '0',
    paddingBottom: '0',
  },
  parentOtsikkoIconBase: {
    backgroundColor: colors.brandGreen,
    padding: '13px',
    marginRight: '10px',
  },
  parentOtsikkoIcon: {
    color: colors.white,
  },
  otsikkoText: {
    textTransform: 'uppercase',
    fontSize: '12px',
    color: colors.brandGreen,
  },
  valintaText: {
    marginTop: '9px',
    marginBottom: '9px',
  },
  valintaIconBase: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderColor: colors.lightGrey,
    padding: '12px',
  },
  valintaIcon: {
    color: colors.brandGreen,
  },
});

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />;
};
const SivuItem = (props) => {
  const classes = useStyles();
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
  const classes = useStyles();
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
  const classes = useStyles();
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
  const classes = useStyles();
  const history = useHistory();
  const { i18n } = useTranslation();
  const { forwardTo } = useContentful();
  const { parent, select, deselect, closeMenu, name, id, links } = props;
  const { state: keepMenuVisible } = useSideMenu();
  const forwardToPage = (id) => {
    history.push(`/${i18n.language}${forwardTo(id)}`);
    if (!keepMenuVisible) {
      closeMenu();
    }
  };

  return (
    <List className={classes.root} aria-label="contacts">
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
    </List>
  );
};

export default SidebarValikko;
