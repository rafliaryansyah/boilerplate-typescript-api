class ApiError extends Error {
    constructor(
        public status: number,
        public name: string,
        public message: string,
        public isOperational: boolean = true,
        public stack: string = ""
    ) {
        super(message);
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
