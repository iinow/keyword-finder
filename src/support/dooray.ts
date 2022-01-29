import http from 'axios'

import { BaseApi } from './base.api'

type Req = {
    botName: string
    text: string
}

export class Dooray extends BaseApi {

    url: string

    constructor(url: string) {
        super()
        this.url = url
    }
    
    async postWebhook(body: string[]) {
        const text = body.length === 0 ? '없음' : body.join('\r')

        const res = await http.post(this.url, <Req>{
            botName: 'Finder',
            text
        })

        return res.status
    }

    call(body: string[]): Promise<number> {
        return this.postWebhook(body)
    }
}