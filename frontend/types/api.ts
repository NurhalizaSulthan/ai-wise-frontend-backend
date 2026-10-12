interface ApiSuccessResponse<T> {
    status: string;
    status_code: number;
    message: string;
    data: T;
}

interface CursorPage<T> {
    data: T[];
    next_cursor: string | null;
    previous_cursor: string | null;
    has_next: boolean;
    has_previous: boolean;
}

export type { ApiSuccessResponse, CursorPage };