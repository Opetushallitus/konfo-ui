export type MurupolkuItem = {
  name: string;
  link?: string | null;
  isCollapsedPart?: boolean;
  isHome?: boolean;
};

export type MurupolkuProps = {
  path: ReadonlyArray<MurupolkuItem>;
};

export type MurupolkuFragmentProps = {
  link?: string | null;
  name: string;
  isLast: boolean;
  openDrawer?: () => void;
  closeDrawer?: () => void;
  isCollapsedPart?: boolean;
  isHome?: boolean;
};

export type MurupolkuDrawerProps = {
  path: ReadonlyArray<MurupolkuItem>;
  onClose: () => void;
  isOpen: boolean;
};
