import { INITIAL_L2_BLOCK_NUM } from '@aztec/circuits.js/constants';
import { MemoryFifo, Semaphore, SerialQueue } from '@aztec/foundation/fifo';
import { createDebugLogger } from '@aztec/foundation/log';
import { InterruptibleSleep } from '@aztec/foundation/sleep';
const log = createDebugLogger('aztec:l2_block_downloader');
/**
 * Downloads L2 blocks from a L2BlockSource.
 * The blocks are stored in a queue and can be retrieved using the getBlocks method.
 * The queue size is limited by the maxQueueSize parameter.
 * The downloader will pause when the queue is full or when the L2BlockSource is out of blocks.
 */
export class L2BlockDownloader {
    constructor(l2BlockSource, maxQueueSize, pollIntervalMS = 10000) {
        this.l2BlockSource = l2BlockSource;
        this.pollIntervalMS = pollIntervalMS;
        this.running = false;
        this.from = 0;
        this.interruptibleSleep = new InterruptibleSleep();
        this.jobQueue = new SerialQueue();
        this.blockQueue = new MemoryFifo();
        this.semaphore = new Semaphore(maxQueueSize);
    }
    /**
     * Starts the downloader.
     * @param from - The block number to start downloading from. Defaults to INITIAL_L2_BLOCK_NUM.
     */
    start(from = INITIAL_L2_BLOCK_NUM) {
        if (this.running) {
            this.interruptibleSleep.interrupt();
            return;
        }
        this.from = from;
        this.running = true;
        const fn = async () => {
            while (this.running) {
                try {
                    await this.jobQueue.put(() => this.collectBlocks());
                    await this.interruptibleSleep.sleep(this.pollIntervalMS);
                }
                catch (err) {
                    log.error(`Error downloading L2 block`, err);
                    await this.interruptibleSleep.sleep(this.pollIntervalMS);
                }
            }
        };
        this.jobQueue.start();
        this.runningPromise = fn();
    }
    /**
     * Repeatedly queries the block source and adds the received blocks to the block queue.
     * Stops when no further blocks are received.
     * @returns The total number of blocks added to the block queue.
     */
    async collectBlocks() {
        let totalBlocks = 0;
        while (true) {
            const blocks = await this.l2BlockSource.getBlocks(this.from, 10);
            if (!blocks.length) {
                return totalBlocks;
            }
            await this.semaphore.acquire();
            this.blockQueue.put(blocks);
            this.from += blocks.length;
            totalBlocks += blocks.length;
        }
    }
    /**
     * Stops the downloader.
     */
    async stop() {
        this.running = false;
        this.interruptibleSleep.interrupt();
        await this.jobQueue.cancel();
        this.blockQueue.cancel();
        await this.runningPromise;
    }
    /**
     * Gets the next batch of blocks from the queue.
     * @param timeout - optional timeout value to prevent permanent blocking
     * @returns The next batch of blocks from the queue.
     */
    async getBlocks(timeout) {
        try {
            const blocks = await this.blockQueue.get(timeout);
            if (!blocks) {
                return [];
            }
            this.semaphore.release();
            return blocks;
        }
        catch (err) {
            // nothing to do
            return [];
        }
    }
    /**
     * Forces an immediate request for blocks.
     * @returns A promise that fulfills once the poll is complete
     */
    pollImmediate() {
        return this.jobQueue.put(() => this.collectBlocks());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibDJfYmxvY2tfZG93bmxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sMl9ibG9ja19kb3dubG9hZGVyL2wyX2Jsb2NrX2Rvd25sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFLN0QsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUUzRDs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyxpQkFBaUI7SUFTNUIsWUFBb0IsYUFBNEIsRUFBRSxZQUFvQixFQUFVLGlCQUFpQixLQUFLO1FBQWxGLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQWdDLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBUDlGLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULHVCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUU5QyxhQUFRLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUM3QixlQUFVLEdBQUcsSUFBSSxVQUFVLEVBQWEsQ0FBQztRQUcvQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsSUFBSSxHQUFHLG9CQUFvQjtRQUN0QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDcEMsT0FBTztR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