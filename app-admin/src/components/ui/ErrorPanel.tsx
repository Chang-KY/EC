import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';

type ErrorPanelProps = {
  title?: string;
  message?: string;
  detail?: string;
  onRetry?: () => void | Promise<unknown>;
  backHref?: string;
  className?: string;
};

export function ErrorPanel({
  title = '문제가 발생했어요',
  message = '요청을 처리하는 중 오류가 발생했습니다.',
  detail,
  onRetry,
  backHref,
  className,
}: ErrorPanelProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(detail ?? '');
      alert('에러 상세가 복사되었습니다.');
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div
      role="alert"
      className={clsx(
        'mx-5 my-6 border border-red-500/30 bg-red-500/[0.07] p-5',
        'shadow-sm ring-1 ring-red-400/10 ring-inset',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 (삼각 경고) */}
        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 flex-none">
          <path
            d="M12 3 1.7 20.3c-.5.8.1 1.7 1 1.7h18.6c.9 0 1.5-.9 1-1.7L12 3Z"
            className="fill-red-500/20"
          />
          <path
            d="M12 8v6m0 3v1"
            className="stroke-red-500"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-red-300">{title}</h2>
          <p className="mt-1 text-sm text-red-200/90">{message}</p>

          {detail && (
            <details className="group mt-3">
              <summary className="cursor-pointer text-xs text-red-200/80 underline decoration-dotted underline-offset-4 select-none">
                자세히 보기
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-black/30 p-3 text-xs text-red-100">
                {detail}
              </pre>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  에러 내용 복사
                </button>
              </div>
            </details>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry()}
                className="rounded-md bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-red-500/30"
              >
                다시 시도
              </button>
            )}
            {backHref && (
              <Link
                href={backHref}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-neutral-200 hover:bg-white/5"
              >
                목록으로
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
