export const formatNumberWithComma = (value: number | string) => {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('en-US').format(num);
};
