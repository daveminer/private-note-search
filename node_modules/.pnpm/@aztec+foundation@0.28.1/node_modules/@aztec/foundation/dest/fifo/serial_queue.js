import { MemoryFifo } from './memory_fifo.js';
/**
 * A more specialized fifo queue that enqueues functions to execute. Enqueued functions are executed in serial.
 */
export class SerialQueue {
    constructor() {
        this.queue = new MemoryFifo();
    }
    /**
     * Initializes the execution of enqueued functions in the serial queue.
     * Functions are executed in the order they were added to the queue, with each function
     * waiting for the completion of the previous one before starting its execution.
     * This method should be called once to start processing the queue.
     */
    start() {
        this.runningPromise = this.queue.process(fn => fn());
    }
    /**
     * Returns the current number of enqueued functions in the serial queue.
     * This provides a way to check the size of the queue and monitor its progress.
     *
     * @returns The length of the serial queue as a number.
     */
    length() {
        return this.queue.length();
    }
    /**
     * Cancels the processing of the remaining functions in the serial queue and resolves the running promise.
     * Any enqueued functions that have not yet been executed will be discarded. The queue can still accept new
     * functions after cancellation, but the previously enqueued functions will not be re-processed.
     *
     * @returns The running promise which resolves when the current executing function (if any) completes.
     */
    cancel() {
        this.queue.cancel();
        return this.runningPromise;
    }
    /**
     * Signals the SerialQueue that it should finish processing its current task and stop accepting new tasks.
     * The returned Promise resolves when all enqueued tasks have completed execution.
     *
     * @returns A Promise that resolves when the queue is completely emptied and no new tasks are allowed.
     */
    end() {
        this.queue.end();
        return this.runningPromise;
    }
    /**
     * Enqueues fn for execution on the serial queue.
     * Returns the result of the function after execution.
     * @param fn - The function to enqueue.
     * @returns A resolution promise. Rejects if the function does, or if the function could not be enqueued.
     */
    put(fn) {
        return new Promise((resolve, reject) => {
            const accepted = this.queue.put(async () => {
                try {
                    const res = await fn();
                    resolve(res);
                }
                catch (e) {
                    reject(e);
                }
            });
            if (!accepted) {
                reject(new Error('Could not enqueue function'));
            }
        });
    }
    /**
     * Awaiting this ensures the queue is empty before resuming.
     */
    async syncPoint() {
        await this.put(async () => { });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsX3F1ZXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpZm8vc2VyaWFsX3F1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ21CLFVBQUssR0FBRyxJQUFJLFVBQVUsRUFBdUIsQ0FBQztJQTBFakUsQ0FBQztJQXZFQzs7Ozs7T0FLRztJQUNJLEtBQUs7UUFDVixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksR0FBRztRQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBSSxFQUFvQjtRQUNoQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUN6QyxJQUFJLENBQUM7b0JBQ0gsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7Z0JBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztvQkFDWCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFNBQVM7UUFDcEIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNGIn0=