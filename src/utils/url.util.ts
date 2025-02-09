/**
 * IF you call chat completion with http mode
 *  this method can build http url
 * @param baseUrl like https://api.openai.com/v1
 * @param urlpath liek chat/completions
 * @returns https://api.openai.com/v1/chat/completions
 */
export const buildHttpUrl = (baseUrl: string, urlpath: string): string => {
  if (!baseUrl?.length || !urlpath.length) return baseUrl ?? urlpath;
  const base = baseUrl.endsWith('/')
    ? baseUrl.substring(0, baseUrl.length - 1)
    : baseUrl;

  return urlpath.startsWith('/') ? `${base}${urlpath}` : `${base}/${urlpath}`;
};
