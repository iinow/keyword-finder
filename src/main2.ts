import { Queue, Worker, QueueScheduler } from 'bullmq';

const myQueue = new Queue('foo');
const myQueueScheduler = new QueueScheduler('foo')

async function main() {
  const worker = new Worker(myQueue.name, async (job: any) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log(job.data);
    return 
  });

  await addJobs()
}

async function addJobs(){
  await myQueue.add('myJobName', { foo: 'bar' }, {
    repeat: {
      // cron: '0/1 * * * * ?'
      cron: '0/1 * * * * *',
      limit: 1,
    },
  });
}

main()