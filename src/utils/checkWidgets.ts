export function widgetUrls(markdown: string): string[] {
  return [
    ...new Set(
      Array.from(markdown.matchAll(/<img\s+src="([^"]+)"/g), (match) =>
        match[1].replaceAll('&amp;', '&')
      )
    ),
  ].filter((url) => url.startsWith('https://'));
}

export async function checkWidgets(
  urls: string[],
  signal: AbortSignal
): Promise<string[]> {
  const results = await Promise.all(
    urls.map(
      (url) =>
        new Promise<string | null>((resolve) => {
          if (signal.aborted) {
            resolve(null);
            return;
          }
          const image = new Image();
          const finish = (failed: boolean) => {
            clearTimeout(timeout);
            image.onload = null;
            image.onerror = null;
            signal.removeEventListener('abort', abort);
            resolve(failed ? url : null);
          };
          const abort = () => finish(false);
          const timeout = setTimeout(() => finish(true), 10000);
          image.referrerPolicy = 'no-referrer';
          image.onload = () => finish(false);
          image.onerror = () => finish(true);
          signal.addEventListener('abort', abort, { once: true });
          image.src = url;
        })
    )
  );
  return results.filter((url): url is string => !!url);
}
