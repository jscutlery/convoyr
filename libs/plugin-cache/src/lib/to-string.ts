export const toString = ([key, param]: [string, string | string[]]): string => {
  return `${key}_${Array.isArray(param) ? param.join('_') : param}`;
};
