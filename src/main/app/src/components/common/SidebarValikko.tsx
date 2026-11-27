import React, { useId } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { ContentfulLink, ContentfulValikko } from '#/src/types/ContentfulTypes';
import { ophColors } from '@opetushallitus/oph-design-system';

const Otsikko = styled('h2')(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: 600,
  fontSize: '15px',
  color: ophColors.grey900,
  margin: theme.spacing(4, 0, 1, 0),
}));

const MenuList = styled('ul')(({ theme }) => ({
  ...theme.typography.body1,
  listStyle: 'none',
  margin: 0,
  padding: 0,
}));

const BorderedItem = styled('li')({
  color: ophColors.grey900,
  borderTop: `1px solid ${ophColors.grey400}`,
  '&:last-child': {
    borderBottom: `1px solid ${ophColors.grey400}`,
  },
});

// Yhteiset tyylit linkeille ja painikkeille, jotta ne näyttävät samalta.
const menuItemStyles = {
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  padding: 0,
  color: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: ophColors.grey50,
  },
  '&:focus-visible': {
    outline: `2px solid ${ophColors.grey900}`,
    outlineOffset: '-2px',
  },
} as const;

const MenuLink = styled('a')(menuItemStyles);

// Valikon avaaminen tai sulkeminen ei ole navigointia, joten niihin käytetään painiketta.
const MenuButton = styled('button')({
  ...menuItemStyles,
  font: 'inherit',
  textAlign: 'left',
  background: 'none',
  fontWeight: 'inherit',
  border: 0,
});

const MenuText = styled('span')(({ theme }) => ({
  flex: '1 1 auto',
  margin: theme.spacing(1.5, 0),
  paddingLeft: theme.spacing(2),
}));

const IconBox = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  minWidth: '48px',
});

const SivuItem = ({
  name,
  href,
  onClick,
}: {
  name: string;
  href: string;
  onClick: (e: React.MouseEvent, href: string) => void;
}) => (
  <BorderedItem>
    <MenuLink href={href} onClick={(e) => onClick(e, href)}>
      <MenuText>{name}</MenuText>
    </MenuLink>
  </BorderedItem>
);

const ValikkoItem = ({
  name,
  id,
  select,
}: {
  name: string;
  id: string;
  select: (id: string) => void;
}) => (
  <BorderedItem>
    <MenuButton type="button" onClick={() => select(id)}>
      <MenuText>{name}</MenuText>
      <IconBox aria-hidden="true" sx={{ borderLeft: `1px solid ${ophColors.grey400}` }}>
        <MaterialIcon icon="chevron_right" sx={{ color: ophColors.green2 }} />
      </IconBox>
    </MenuButton>
  </BorderedItem>
);

export const SidebarValikko = (props: {
  parent?: ContentfulValikko;
  select: (id: string) => void;
  deselect: () => void;
  closeMenu: () => void;
  name: string;
  links: Array<ContentfulLink>;
  // Sovelluksen sisäiset linkit, jotka eivät tule Contentfulista. href ilman kielietuliitettä.
  internalLinks?: Array<{ name: string; href: string }>;
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { forwardTo } = useContentful();
  const { parent, select, deselect, closeMenu, name, links, internalLinks } = props;
  const headingId = useId();

  const forwardToPage = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
    closeMenu();
  };

  return (
    <nav aria-labelledby={headingId}>
      {parent ? (
        <MenuButton
          type="button"
          onClick={deselect}
          sx={{
            marginTop: 4,
            paddingLeft: 0,
            backgroundColor: ophColors.grey50,
            fontWeight: 600,
          }}>
          <IconBox
            aria-hidden="true"
            sx={{
              backgroundColor: ophColors.green2,
            }}>
            <MaterialIcon icon="chevron_left" sx={{ color: ophColors.white }} />
          </IconBox>
          <MenuText>{parent.name}</MenuText>
        </MenuButton>
      ) : null}
      <Otsikko id={headingId}>{name}</Otsikko>
      <MenuList>
        {links.map((i) =>
          i.type === 'sivu' ? (
            <SivuItem
              key={`sivu-item-${i.name}`}
              name={i.name}
              href={`/${i18n.language}${forwardTo(i.id)}`}
              onClick={forwardToPage}
            />
          ) : (
            <ValikkoItem
              key={`valikko-item-${i.name}`}
              name={i.name}
              id={i.id}
              select={select}
            />
          )
        )}
        {internalLinks?.map((link) => (
          <SivuItem
            key={`internal-item-${link.href}`}
            name={link.name}
            href={`/${i18n.language}${link.href}`}
            onClick={forwardToPage}
          />
        ))}
      </MenuList>
    </nav>
  );
};
