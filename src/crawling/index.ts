import { JGameCafe } from './jgame.naver'
import { CrawType } from '../common/craw.enum'

let jGameCate: JGameCafe

export default (type: CrawType) => {
    if (type.valueOf() === CrawType.JGAME_NAVER_CAFE) {
        if (!jGameCate) {
            jGameCate = new JGameCafe(type)
        }

        return jGameCate
    }

    throw new Error(`CrawType is required!!!`)
}
