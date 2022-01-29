import { Dooray } from './dooray'
import { BaseApi } from './base.api'

const doorayWebhookUrl = process.env.DOORAY_WEBHOOK_URL

export default (): BaseApi => {
    
    if(doorayWebhookUrl) {
        return new Dooray(doorayWebhookUrl)
    }

    throw new Error(`doorayWebhookUrl is required!!!`)
}