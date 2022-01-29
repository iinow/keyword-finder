import { CrawType } from '../common/craw.enum'

export type BaseParam = {
    keywords: string[]
}

export type BaseOutput = {
    keywords: string[]
}

export abstract class Base<T> {
    
    protected type: CrawType

    constructor(type: CrawType) {
        this.type = type
    }

    abstract execute(param: BaseParam): Promise<BaseOutput>
}