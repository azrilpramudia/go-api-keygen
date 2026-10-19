package rest

type GenerateRequest struct {
	Bits   int    `json:"bits" binding:"required"`
	Format string `json:"format" binding:"required"`
	Prefix string `json:"prefix"`
	Count  int    `json:"count"`
}

type KeyResponse struct {
	Value  string `json:"value"`
	Bits   int    `json:"bits"`
	Format string `json:"format"`
	Level  string `json:"level"`
}

type GenerateResponse struct {
	Keys []KeyResponse `json:"keys"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
