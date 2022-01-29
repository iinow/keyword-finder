export abstract class BaseApi {

    abstract call(body: string[]): Promise<number>
}