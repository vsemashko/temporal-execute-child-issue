import { v4 as uuid } from 'uuid';
export async function getNextBatch(page = 0): Promise<{nextBatch: string[], isLast: boolean}> {
    const result: {nextBatch: string[], isLast: boolean} = {
        nextBatch: [],
        isLast: false
    }
    if (page > 9) {
        result.isLast = true
        return result
    }

    for (let i = 0; i < 500; i++) {
        result.nextBatch.push(uuid())
    }
    return result;
}

export async function greet(name: string): Promise<string> {
    return `Hello, ${name}!`;
}
