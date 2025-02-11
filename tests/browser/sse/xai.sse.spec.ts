

import { SseFetchError } from '../../../src/browser/index'

describe(`Xai [browser] XaiStreamFetch tests`, () => {

  beforeEach(()=>{
    globalThis.fetch = jest.fn()
  })

  afterEach(()=>{
    jest.clearAllMocks()
  })
  it('Test common fetch should return ok',async ()=>{
    const mockData = {code:200,message:'success',result:'ok'}

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok:true,
      json:()=>Promise.resolve(mockData)
    })

    const response = await fetch('/api/v3/chat/chat_sse_stream')

    const data = await response.json()

    expect(data).toEqual(mockData)
  })

  it('Test common fetch error',async ()=>{
    globalThis.fetch = jest.fn().mockRejectedValue(SseFetchError.newSseError(500,'SSE service error'))

    await expect(fetch('/api/v3/chat')).rejects.toThrow('SSE service error1')
  })
});
