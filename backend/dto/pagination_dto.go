package dto

type PaginationDTO struct {
	Data           interface{} `json:"data"`
	NextCursor     *string     `json:"next_cursor"`
	PreviousCursor *string     `json:"previous_cursor"`
	HasNext        bool        `json:"has_next"`
	HasPrevious    bool        `json:"has_previous"`
}

type PaginationResult struct {
	Data           interface{}
	NextCursor     *string
	PreviousCursor *string
	HasNext        bool
	HasPrevious    bool
}
