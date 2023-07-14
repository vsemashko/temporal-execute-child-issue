import {continueAsNew, executeChild, LoggerSinks, proxyActivities, proxySinks, sleep} from '@temporalio/workflow';
import type * as activities from './activities';

const {greet, getNextBatch} = proxyActivities<typeof activities>({
    startToCloseTimeout: '10 seconds',
});

const { defaultWorkerLogger: logger } = proxySinks<LoggerSinks>();

export async function parentWorkflow(nextPage = 0, processed = 0): Promise<string> {
    const {nextBatch, isLast} = await getNextBatch(nextPage);

    logger.info('Will sleep for 10s', {});
    await sleep(10000)
    logger.info('Will start child workflows', {});

    const responseArray = await Promise.allSettled(
        nextBatch.map((name) =>
            executeChild(childWorkflow, {
                args: [name],
            })
        )
    );

    processed += responseArray.length;

    if (isLast) {
        return `Processed ${processed} items`;
    }

    await continueAsNew<typeof parentWorkflow>(nextPage + 1, processed);
    return 'Unreachable';
}

export async function childWorkflow(name: string): Promise<string> {
    return greet(name)
}
