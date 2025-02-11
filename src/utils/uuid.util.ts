import { customAlphabet, nanoid } from 'nanoid';

export const BASE58_ALPHABET_SEED =
  '123456789abcdefjhijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
export const REQID_ALPHABET_SEED = '0123456789abcdefghijkmnpqrstuvwxyz._';
export const COMMON_ALPHABET_SEED =
  '123456789fghijkmnpqrstuvwxyzACDEFGHJMNPQRSTUVWXYZ-_';
export const CHAT_MESSAGEID_SEED =
  '123456789fghijkmnpqrstuvwxyzACDEFGHJMNPQRSTUVWXYZ.$';

export function createRequestId(): string {
  return nanoid();
}

/**
 *
 * @param len min 6 max 40
 * @returns string
 */
export function createBase58RandomId(len: number = 16): string {
  let size = len;

  if (size < 6) {
    size = 6;
  }
  if (size > 40) {
    size = 40;
  }
  const customNanoid = customAlphabet(BASE58_ALPHABET_SEED, size);

  return customNanoid();
}

/**
 *
 * @param prefix
 * @returns
 */
export function createClientId(prefix: string = ''): string {
  const customNanoid = customAlphabet(COMMON_ALPHABET_SEED, 16);
  const id = customNanoid();
  return prefix?.trim().length ? `${prefix.trim()}_${id}` : `loto_${id}`;
}

/**
 *
 * @param prefix
 * @returns
 */
export function createChatid(prefix: string = 'xchat'): string {
  const customNanoid = customAlphabet(
    '123456789fghijkmnpqrstuvwxyzACDEFGHJMNPQRSTUVWXYZ',
    16,
  );
  const id = customNanoid();
  return prefix?.trim().length ? `${prefix.trim()}_${id}` : `xchat_${id}`;
}

/**
 * chat message id
 * @param len
 * @param uuid
 * @returns
 */
export function createChatMessageId(len: number = 20, uuid?: number): string {
  const size = len > 10 && len < 32 ? len : 20;
  const customNanoid = customAlphabet(
    '.123456789.fghijkmnpqrstuvwxyz.ACDEFGHJMNPQRSTUVWXYZ.',
    size,
  );
  const id = customNanoid();

  return uuid ? `${uuid}-${id}` : id;
}
