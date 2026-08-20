import express, { type Express, type Request, type Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import 'dotenv/config'

const app: Express = express()
const port = 5055


app.use(express.urlencoded({ extended: true }))//用来解析扩展url编码的请求体
app.use(express.json())//用来解析json请求体

app.post('/api/chat', wrapper(async (req: Request, res: Response) => {
  // console.log(req.body)


  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN

  const anthropic = new Anthropic({
    apiKey,
    baseURL: 'https://ai-gateway.vercel.sh',
  })

  const { chatId, model, messages } = req.body
  console.log(model)
  const message = await anthropic.messages.create({
    model: model,
    messages: messages,
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0,
    reasoning_effort: 'low',
  });

  console.log('Response:', message.content)
  // console.log('Usage:', message.usage);


  if (message.content.length > 0) {
    const content = message.content.filter((item: any) => item.type === 'text')
    res.json(content)
  }

}))





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




function wrapper(asyncMiddleware) {
  return (req, res, next) => {
    asyncMiddleware(req, res, next).catch(err => {
      next(err)
    })
  }
}

