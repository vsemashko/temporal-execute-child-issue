import {Client, Connection} from '@temporalio/client';
import {parentWorkflow} from './workflows';
import {TEMPORAL_NAMESPACE, TEMPORAL_CONNECTION_OPTIONS} from './connection';

async function run() {

    const client = new Client({
            connection: await Connection.connect(TEMPORAL_CONNECTION_OPTIONS),
            namespace: TEMPORAL_NAMESPACE
        }
    );

    const result = await client.workflow.execute(parentWorkflow, {
        taskQueue: 'child-workflows',
        workflowId: 'parent-sample-0',
        args: [],
    });
    console.log(result);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
