interface ApiErrorResponse {
    code: string;
    message: string;
    status_code: number;
}

class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
    ) {
        super(message);
    }
}

export type { ApiErrorResponse };
export { ApiError };