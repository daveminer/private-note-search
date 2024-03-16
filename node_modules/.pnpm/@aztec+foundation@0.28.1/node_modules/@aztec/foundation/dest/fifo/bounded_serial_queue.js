import { createDebugLogger } from '../log/index.js';
import { Semaphore } from './semaphore.js';
import { SerialQueue } from './serial_queue.js';
/**
 * Leverages the unbounded SerialQueue and Semaphore to create a SerialQueue that will block when putting an item
 * if the queue size = maxQueueSize.
 */
export class BoundedSerialQueue {
    constructor(maxQueueSize, log = createDebugLogger('aztec:foundation:bounded_serial_queue')) {
        this.log = log;
        this.queue = new SerialQueue();
        this.semaphore = new Semaphore(maxQueueSize);
    }
    /**
     * Initializes the underlying SerialQueue instance, allowing items to be processed from the queue.
     * The start method should be called before using the BoundedSerialQueue to ensure proper functionality.
     */
    start() {
        this.queue.start();
    }
    /**
     * Returns the current number of items in the queue.
     * This is useful for monitoring the size of BoundedSerialQueue and understanding its utilization.
     *
     * @returns The length of the queue as an integer value.
     */
    length() {
        return this.queue.length();
    }
    /**
     * Cancels the current operation in the SerialQueue, if any, and clears the queue.
     * Any pending tasks in the queue will not be executed, and the queue will be emptied.
     * This method is useful for cleaning up resources and stopping ongoing processes when they are no longer needed.
     * @returns A promise, resolved once cancelled.
     */
    cancel() {
        return this.queue.cancel();
    }
    /**
     * Ends the queue processing gracefully, preventing new items from being added.
     * The currently executing item, if any, will complete and remaining queued items
     * will be processed in order. Once all items have been processed, the queue becomes
     * permanently unusable.
     *
     * @returns A promise that resolves when all items in the queue have been processed.
     */
    end() {
        return this.queue.end();
    }
    /**
     * The caller will block until fn is successfully enqueued.
     * The fn itself is execute asynchronously and its result discarded.
     * TODO(AD) do we need this if we have exec()?
     * @param fn - The function to call once unblocked.
     */
    async put(fn) {
        await this.semaphore.acquire();
        this.queue
            .put(async () => {
            try {
                await fn();
            }
            finally {
                this.semaphore.release();
            }
        })
            .catch(err => {
            this.log.error('BoundedSerialQueue handler exception:', err);
        });
    }
    /**
     * The caller will block until fn is successfully executed, and it's result returned.
     * @param fn - The function.
     * @returns A promise that resolves with the result once executed.
     */
    async exec(fn) {
        await this.semaphore.acquire();
        return this.queue.put(async () => {
            try {
                return await fn();
            }
            finally {
                this.semaphore.release();
            }
        });
    }
    /**
     * Awaiting this ensures the queue is empty before resuming.
     */
    async syncPoint() {
        await this.queue.syncPoint();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm91bmRlZF9zZXJpYWxfcXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmlmby9ib3VuZGVkX3NlcmlhbF9xdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWhEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxrQkFBa0I7SUFJN0IsWUFBWSxZQUFvQixFQUFVLE1BQU0saUJBQWlCLENBQUMsdUNBQXVDLENBQUM7UUFBaEUsUUFBRyxHQUFILEdBQUcsQ0FBNkQ7UUFIekYsVUFBSyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFJekMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSztRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksR0FBRztRQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXVCO1FBQ3RDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSzthQUNQLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ2IsQ0FBQztvQkFBUyxDQUFDO2dCQUNULElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFJLEVBQW9CO1FBQ3ZDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQy9CLElBQUksQ0FBQztnQkFDSCxPQUFPLE1BQU0sRUFBRSxFQUFFLENBQUM7WUFDcEIsQ0FBQztvQkFBUyxDQUFDO2dCQUNULElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFNBQVM7UUFDcEIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9CLENBQUM7Q0FDRiJ9