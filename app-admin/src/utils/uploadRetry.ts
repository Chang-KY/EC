type UploadOk = { index: number; path: string }
type UploadFail = { index: number; fileName: string; message: string }

type UploadManyResult = {
  ok: UploadOk[]
  failed: UploadFail[]
}

function toErrMsg(e: unknown) {
  return e instanceof Error ? e.message : String(e)
}

export async function uploadRetry(
  files: File[],
  bucket: string,
  baseDir: string,
  uploadFile: (prefix: string, file: File, bucket: string) => Promise<string>,
  opts?: { retries?: number },
): Promise<UploadManyResult> {
  const retries = opts?.retries ?? 2
  let queue = files.map((file, index) => ({ file, index }))
  const ok: UploadOk[] = []
  const lastErrors = new Map<number, string>()

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (queue.length === 0) break

    const settled = await Promise.allSettled(
      queue.map(({ file, index }) =>
        uploadFile(`${baseDir}/${index}_${crypto.randomUUID()}_`, file, bucket).then((path) => ({
          index,
          path,
        })),
      ),
    )

    const nextQueue: typeof queue = []

    for (let i = 0; i < settled.length; i++) {
      const r = settled[i]
      const { file, index } = queue[i]!

      if (r.status === 'fulfilled') {
        ok.push({ index, path: r.value.path })
        lastErrors.delete(index)
      } else {
        const msg = toErrMsg(r.reason)
        lastErrors.set(index, msg)
        nextQueue.push({ file, index }) // 실패한 것만 다시 시도
      }
    }
    queue = nextQueue
    if (queue.length > 0 && attempt < retries) {
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)))
    }
  }

  const failed: UploadFail[] = queue.map(({ index, file }) => ({
    index,
    fileName: file.name,
    message: lastErrors.get(index) ?? 'upload failed',
  }))

  return { ok, failed }
}
