export const isEmptyString = (value: string): boolean => {
  const reVal = value.replace(/ /g, "") === "";
  return reVal;
};
