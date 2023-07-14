import {NativeConnection, Worker} from '@temporalio/worker';
import * as activities from './activities';
import {TEMPORAL_CONNECTION_OPTIONS, TEMPORAL_NAMESPACE} from './connection';

async function run() {
  const worker = await Worker.create({
    namespace: TEMPORAL_NAMESPACE,
    connection: await NativeConnection.connect(TEMPORAL_CONNECTION_OPTIONS),
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'child-workflows',
    maxConcurrentActivityTaskExecutions: 1,
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
