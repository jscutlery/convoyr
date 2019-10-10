type PrimitiveType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'object'
  | 'symbol'
  | 'undefined';

export function isTypeof(type: PrimitiveType): (value: any) => boolean {
  return (value: any): boolean => {
    return typeof value === type;
  };
}
