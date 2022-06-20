export const isHakuAuki = (hakuajat = []) =>
  hakuajat.some((hakuaika) => hakuaika?.hakuAuki);

export const isHakuMennyt = (hakuajat = []) =>
    hakuajat.every((hakuaika) => hakuaika?.hakuMennyt);
