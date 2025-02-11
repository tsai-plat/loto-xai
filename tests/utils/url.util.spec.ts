import {
  buildHttpUrl,
  DEEPSEEK_BASEURL,
  OPENAI_CHAT_COMPLETIONS_PATH,
} from '../../src/index';

describe('Xai [utils] url.util tests', () => {
  const baseUrl = DEEPSEEK_BASEURL;
  const deepseekChatUrl = `${baseUrl}/${OPENAI_CHAT_COMPLETIONS_PATH}`;

  it(`Build Deepseek chat completion url should return ${deepseekChatUrl}`, () => {
    expect(buildHttpUrl(DEEPSEEK_BASEURL, OPENAI_CHAT_COMPLETIONS_PATH)).toBe(
      deepseekChatUrl,
    );
  });

  it(`Build Deepseek with baseUrl has end should return ${deepseekChatUrl}`, () => {
    expect(
      buildHttpUrl(DEEPSEEK_BASEURL + '/', OPENAI_CHAT_COMPLETIONS_PATH),
    ).toBe(deepseekChatUrl);
  });

  it(`Build Deepseek with path has start should return ${deepseekChatUrl}`, () => {
    expect(
      buildHttpUrl(DEEPSEEK_BASEURL, '/' + OPENAI_CHAT_COMPLETIONS_PATH),
    ).toBe(deepseekChatUrl);
  });

  it(`Build Deepseek both baseUrl & path has splitor should return ${deepseekChatUrl}`, () => {
    expect(
      buildHttpUrl(DEEPSEEK_BASEURL + '/', '/' + OPENAI_CHAT_COMPLETIONS_PATH),
    ).toBe(deepseekChatUrl);
  });

  it(`Build Deepseek both baseUrl & path empty should return null`, () => {
    expect(buildHttpUrl('', '')).toBe('');
  });

  it(`Build Deepseek baseUrl is empty should return ${DEEPSEEK_BASEURL}`, () => {
    expect(buildHttpUrl(DEEPSEEK_BASEURL, '')).toBe(DEEPSEEK_BASEURL);
  });

  it(`Build Deepseek path is empty should return null`, () => {
    expect(buildHttpUrl('', OPENAI_CHAT_COMPLETIONS_PATH)).toBe('');
  });
});
