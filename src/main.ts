import express from 'express'
import Queue from 'bull'
import { Queue as QueueMQ, Worker, QueueScheduler, ConnectionOptions } from 'bullmq'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'

import api from './support'
import crawler from './crawling'
import { CrawType } from './common/craw.enum'

let temp: []

type ReqAdd = {
  keywords: string[]
  crawType: CrawType
}

const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t * 1000));

const redisOptions: ConnectionOptions = {
  port: 6379,
  host: 'localhost',
  password: '',
//   tls: false,
};

const createQueueMQ = (name: string) => new QueueMQ(name, { connection: redisOptions });

async function setupBullMQProcessor(queueName: string) {
  const queueScheduler = new QueueScheduler(queueName, {
    connection: redisOptions,
  });

  await queueScheduler.waitUntilReady();

  new Worker(queueName, async (job) => {
    await job.log(`Processing Api call`);
    
    const data: ReqAdd = job.data

    const findKeywords = await crawler(data.crawType).execute({
      keywords: data.keywords
    })

    console.log('res', findKeywords)

    if (findKeywords.keywords.length === 0) {
      const res = await api().call(findKeywords.keywords)
      await job.log(`api call status code: ${res}, data: ${findKeywords.keywords}`);
    }
    
    await job.updateProgress(100);
  });
}

const run = async () => {
  const exampleBullMq = createQueueMQ('Crawer');
  new QueueScheduler('Crawer')
  // const crawerMq = new Queue('Crawer', { redis: redisOptions })

  await setupBullMQProcessor(exampleBullMq.name);
  // await crawerMq.process(setupCrawerProcessor)

  const app = express();
  app.use(express.json())

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: [new BullMQAdapter(exampleBullMq)],
    serverAdapter,
  });

  app.use('/ui', serverAdapter.getRouter());

  app.post('/api/keywords', (req, res) => {
    if(!req.body.keywords?.length) {
      throw new Error('keyword is required!!!, data: ' + req.query.keywords)
    }

    if(!req.body.crawType) {
      throw new Error('crawType is required!!!')
    }

    exampleBullMq.add('Keyword Finder', { keywords: req.body.keywords, crawType: req.body.crawType }, {
      repeat: {
        cron: '0 0 0/1 * * *'
      }
    })

    res.json({
      ok: true,
    });
  });

  app.listen(3000, () => {
    console.log('Running on 3000...')
    // exampleBullMq.add('Keyword Finder', { keywords: ['피파'], crawType: 11 }, {
    //   repeat: {
    //     cron: '0/1 * * * * *'
    //   }
    // })
  });
};

// eslint-disable-next-line no-console
run().catch((e) => console.error(e));
