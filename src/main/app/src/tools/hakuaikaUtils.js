export const isHakuAuki = (hakuajat = []) =>
  hakuajat.some((hakuaika) => hakuaika?.hakuAuki);
