import {
  createChatid,
  createChatMessageId,
  createRequestId,
  createClientId,
  createBase58RandomId,
} from '../../src/utils/uuid.util';

describe('Xai [utils] uuid.util tests', () => {
  it('Test [createRequestId] should return an random request id', () => {
    const reqid = createRequestId();
    expect(reqid).toHaveLength(21);
  });

  it('Test [createBase58RandomId] should return an random string with length 16', () => {
    const reqid = createBase58RandomId();
    expect(reqid).toHaveLength(16);
  });

  it('Test [createClientId] should return an random string with length 16', () => {
    const id = createClientId();
    expect(id).toHaveLength(21);
  });

  it('Test [createClientId] should return true', () => {
    const id = createClientId('tsai');

    expect(/^tsai_(.*)$/.test(id)).toBe(true);
  });

  it('Test [createChatid] should return true', () => {
    const id = createChatid();

    expect(/^xchat_(.*)$/.test(id)).toBe(true);
  });

  it('Test [createChatMessageId] should return random message id with length 20', () => {
    const id = createChatMessageId();
    expect(id).toHaveLength(20);
  });

  it('Test [createChatMessageId] should return random message id start with 2001-', () => {
    const id = createChatMessageId(16, 2001);
    expect(/^2001-(.*)$/.test(id)).toBe(true);
  });
});
