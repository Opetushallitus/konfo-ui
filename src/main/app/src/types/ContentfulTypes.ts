export type Contentful = {
  id: string;
  name: string;
  type: string;
  created: string;
  updated: string;
};

export type ContentfulItem = {
  id: string;
  name: string;
  type: string;
};

// TODO: Tarkka tyypitys puuttuu, ei tietoa millaista dataa on
export type Info = Record<
  string,
  {
    id: string;
    linkki?: { id: string };
    content: string;
  }
>;

export type Kortit = Record<
  string,
  Contentful & {
    kortit: Array<ContentfulItem>;
  }
>;

export type Uutiset = Record<
  string,
  Contentful & {
    slug: string;
    linkit: Array<ContentfulItem>;
  }
>;
