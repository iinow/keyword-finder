import http from 'axios'
import hash from 'object-hash'

import { Base, BaseParam, BaseOutput } from './base'

export class JGameCafe extends Base<string> {

    private preHash: string = hash('')
    
    private async get(param: BaseParam): Promise<BaseOutput> {
        const res = await http.get('https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/27485605/articles/10774?query=&menuId=56&boardType=L&useCafeId=true&requestFrom=A')
        let body: string = res.data?.result?.article?.contentHtml
        if (!body) {
            body = ''
        }

        const hashString = hash(body)
        if (this.preHash === hashString) {
            return {
                keywords: []
            }
        }

        this.preHash = hashString

        return {
            keywords: param.keywords.filter((keyword) => body.includes(keyword))
        }
    }

    execute(param: BaseParam): Promise<BaseOutput> {
        return this.get(param)
    }
}