export const NumberExpressionFn: {[key: string]: (field: string, value?: number | number[]) => string} = {
  "greater than": (field: string, value?: number | number[]) => `${field} > ${value}`,
  "less than": (field: string, value?: number | number[]) => `${field} < ${value}`,
  "equal to": (field: string, value?: number | number[]) => `${field} = ${value}`,
  "does not equal to": (field: string, value?: number | number[]) => `${field} != ${value}`,
  "is greater than or equal to": (field: string, value?: number | number[]) => `${field} >= ${value}`,
  "is less than or equal to": (field: string, value?: number | number[]) => `${field} <= ${value}`,
  "between": (field: string, value?: number | number[]) => `${field} between ${(value as number[])[0]} and ${(value as number[])[1]}`,
  "not between": (field: string, value?: number | number[]) => `${field} not between ${(value as number[])[0]} and ${(value as number[])[1]}`,
  "one of": (field: string, value?: number | number[]) => `${field} = any(${value})`,
  "none one of": (field: string, value?: number | number[]) => `${field} != any(${value})`,
  "is empty": (field: string) => `${field} is null`,
  "is not empty": (field: string) => `${field} is not null`
};
