import {z} from 'zod';

const IdSchema = z.coerce.number().int().positive(); // "12" -> 12, 실패시 에러

export const checkTypeNumber = (raw: unknown) => {
  const r = IdSchema.safeParse(raw);
  if (!r.success) {
    const e = new Error('BAD_REQUEST');
    (e as any).code = 'BAD_REQUEST';
    throw e; // 페이지 단에서 try/catch로 400/404 처리
  }
  return typeof r.data === 'number';
};
