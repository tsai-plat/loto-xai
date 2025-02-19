<h1 align="center">@tsailab/xai</h1>
<p align="center" >
  <a href="https://github.com/tsai-plat" target="blank">
    <img src="https://ucarecdn.com/eac2c945-177d-4fc9-8bc1-fa2be48ad3a2/lotolab_golden.svg" width="100" alt="Tsai Logo" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/l/%40tsailab%2Fxai?color=%23FFDEAD&label=License" alt="License" /></a>
  <a href="https://discord.gg/lotolab" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://x.com/lamborghini171" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>  
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/v/%40tsailab%2Fxai" alt="@tsailab/loto-xai" /></a>
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/dy/%40tsailab%2Fxai?style=flat&logoColor=%23FA0809" alt="Downloads" /></a>
</p>

## Installation

```
$ npm install -g @tsailab/xai
```

## Usage

> browser front SSE fetch

```ts

  // abort request
  let controller = new AbortController()

  // SSE request body data
  const sseBody: XaiStreamableRequestData = {
    controller,
    chatid: 'xai-chatid-001', // required string ,your front app chat id
    provider: 'deepseek', // which provide api service 
    model, // model id 
    uuid, // required number 
    // text: prompt.value, front user input text or handler messages 
    messages: [ // see openai message
      {
        role: 'user',
        content: 'who are you?', 
      },
    ],
  }

  // the SSE streamable response chunk appending text
  let fullResult:string = ''

  const sseClient = new XaiSseFetch(
    apiPath:'http://127.0.0.1:8964/v1',
    { 
      apiBasePrefix:'chat/completions',
      eventDataParsed:true, // control return chunk parsed to JSON Object OR string
      debug: true, // if true will print some log
      // handle streamable chunk content,add update chat result text typed.
      onmessage:(chunk:any) => {
        console.log(chunk, `onMessage>>>>>>>>>>>${typeof chunk}`)
        // if eventDataParsed=false chunk is string
        try{
          const {content} = JSON.parse(chunk)

          fullResult = fullResult + content
        }catch(_){

        }

        // if eventDataParsed=true chunk is object
        fullResult = fullResult + chunk.content

      },
      onerror: (err: any) => {
        console.log(err, '<<<<<>>>>Error>>>>')
      },
      oncancel: () => {
        console.log('>>>>>>>>>>>>>Cancel>>>>>>')
      },
      onclose: () => {
        console.log('>>>>>>>Closed>>>>>')
      },
    }
  )

  // launch SSE fetch
  await cli.connect(sseBody, (cache: any) => {
      // first connect handle ssebody merge remote model options 
      console.log('>>>>>>> preconnect>> cache>>>', cache)
  })


```

> front localstore helper 

```ts
newChatbotAgent(...)
createNewUserMessage(...)
createInitAssistantMessage(...)
updateSomeChatbotMessage(...)
```

## Contribution 

> the `Code` submission specifications follow angular standards

> you can visit [rules](https://github.com/tsai-plat/.github/blob/main/wiki/commit-rules.md) link,see more infomation. 

------

## Stay in touch

- Twitter - [@lamborghini171](https://twitter.com/lamborghini171)

:revolving_hearts::revolving_hearts::revolving_hearts: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand::raising_hand::raising_hand::revolving_hearts::revolving_hearts::revolving_hearts:

<font color="#ff8f00"><h3>Sincerely invite experts to improve the project functions together !</h3></font>

:revolving_hearts::revolving_hearts::revolving_hearts: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand::raising_hand::raising_hand::revolving_hearts: :revolving_hearts::revolving_hearts:

## License

The @Tsailab/xai packages is [MIT licensed](LICENSE).

> Give me a cup of coffee? Thanks much.

<center>
  <span>  
    <img src="https://ucarecdn.com/8dd30913-02fb-4d06-b341-759e186a611a/lanberyethda59.png" width="100" height="100" alt="My ETH"/>
    <span> My ETH </span>
  </span>


  <span>
    <img src="https://ucarecdn.com/f0adc5e7-0b87-4f9a-825a-166a480a9bc8/lanberywechattoll.png" width="100" height="100" alt="My WECHAT"/>
    <span> My WECHAT </span>
  </span>
</center>

