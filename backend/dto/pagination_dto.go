package dto

type PaginationDTO struct {
	Data           []TelemetryBase `json:"data"`
	NextCursor     *string         `json:"next_cursor"`
	PreviousCursor *string         `json:"previous_cursor"`
	HasNext        bool            `json:"has_next"`
	HasPrevious    bool            `json:"has_previous"`
}

type PaginationResult struct {
	Data           []TelemetryBase
	NextCursor     *string
	PreviousCursor *string
	HasNext        bool
	HasPrevious    bool
}
