export const toNum = (v: unknown): number | undefined => {
  // 빈 값은 모두 undefined 로 보내기 (required_error 터지게)
  if (v == null || v === '') return undefined;

  const n = Number(String(v).replace(/,/g, ''));
  // 숫자로 파싱 안 되면 undefined 로 보내기
  return Number.isFinite(n) ? n : undefined;
};
