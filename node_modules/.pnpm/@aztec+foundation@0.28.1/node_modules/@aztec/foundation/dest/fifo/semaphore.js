import { MemoryFifo } from './memory_fifo.js';
/**
 * Allows the acquiring of up to `size` tokens before calls to acquire block, waiting for a call to release().
 */
export class Semaphore {
    constructor(size) {
        this.queue = new MemoryFifo();
        new Array(size).fill(true).map(() => this.queue.put(true));
    }
    /**
     * Acquires a token from the Semaphore, allowing access to a limited resource.
     * If no tokens are available, the call will block and wait until a token is released.
     * Use in conjunction with the release() method to manage access to resources with limited capacity.
     *
     * @returns A Promise that resolves when a token is acquired.
     */
    async acquire() {
        await this.queue.get();
    }
    /**
     * Releases a token back into the semaphore, allowing another acquire call to proceed.
     * If there are any pending calls to acquire(), one of them will be unblocked and allowed to proceed.
     * This method should only be called by the holder of the acquired token to ensure proper functionality
     * and avoid unexpected behavior.
     */
    release() {
        this.queue.put(true);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtYXBob3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpZm8vc2VtYXBob3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBR3BCLFlBQVksSUFBWTtRQUZQLFVBQUssR0FBRyxJQUFJLFVBQVUsRUFBVyxDQUFDO1FBR2pELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE9BQU87UUFDbEIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE9BQU87UUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0YifQ==