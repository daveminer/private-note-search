/**
 * TimeoutTask class creates an instance for managing and executing a given asynchronous function with a specified timeout duration.
 * The task will be automatically interrupted if it exceeds the given timeout duration, and will throw a custom error message.
 * Additional information such as execution time can be retrieved using getTime method after the task has been executed.
 *
 * @typeparam T - The return type of the asynchronous function to be executed.
 */
export class TimeoutTask {
    constructor(fn, timeout = 0, fnName = '') {
        this.fn = fn;
        this.timeout = timeout;
        this.interrupt = () => { };
        this.totalTime = 0;
        this.interruptPromise = new Promise((_, reject) => {
            this.interrupt = () => reject(new Error(`Timeout${fnName ? ` running ${fnName}` : ''} after ${timeout}ms.`));
        });
    }
    /**
     * Executes the given function with a specified timeout.
     * If the function takes longer than the timeout, it will be interrupted and an error will be thrown.
     * The total execution time of the function will be stored in the totalTime property.
     *
     * @returns The result of the executed function if completed within the timeout.
     * @throws An error with a message indicating the function was interrupted due to exceeding the specified timeout.
     */
    async exec() {
        const interruptTimeout = !this.timeout ? 0 : setTimeout(this.interrupt, this.timeout);
        try {
            const start = Date.now();
            const result = await Promise.race([this.fn(), this.interruptPromise]);
            this.totalTime = Date.now() - start;
            return result;
        }
        finally {
            clearTimeout(interruptTimeout);
        }
    }
    /**
     * Returns the interrupt promise associated with the TimeoutTask instance.
     * The interrupt promise is used internally to reject the task when a timeout occurs.
     * This method can be helpful when debugging or tracking the state of the task.
     *
     * @returns The interrupt promise associated with the task.
     */
    getInterruptPromise() {
        return this.interruptPromise;
    }
    /**
     * Get the total time spent on the most recent execution of the wrapped function.
     * This method provides the duration from the start to the end of the function execution, whether it completed or timed out.
     *
     * @returns The total time in milliseconds spent on the most recent function execution.
     */
    getTime() {
        return this.totalTime;
    }
}
export const executeTimeout = async (fn, timeout = 0, fnName = '') => {
    const task = new TimeoutTask(fn, timeout, fnName);
    return await task.exec();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90aW1lci90aW1lb3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBS3RCLFlBQW9CLEVBQW9CLEVBQVUsVUFBVSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUU7UUFBdEQsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFJO1FBSHJELGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUdwQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0csQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEtBQUssQ0FBQyxJQUFJO1FBQ2YsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDcEMsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQkFBbUI7UUFDeEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFLLEVBQW9CLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDeEYsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQyJ9