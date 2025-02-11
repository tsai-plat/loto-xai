export const createMockResponse = (data:any,options:{[k:string]:any}={})=>({
  ok:true,
  status:200,
  json:()=>Promise.resolve(data),
  ...options
})
