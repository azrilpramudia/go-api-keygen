package domain

import "errors"

type Format string

const (
	FormatHex    Format = "hex"
	FormatBase64 Format = "base64"
	FormatBase62 Format = "base62"
	FormatUUID   Format = "uuid"
)

type Level string

const (
	LevelWeak   Level = "weak"
	LevelMedium Level = "medium"
	LevelHigh   Level = "high"
)

var (
	ErrInvalidBits     = errors.New("bits must be one of 16, 32, 48, 64, 128, 256")
	ErrInvalidFormat   = errors.New("unsupported format")
	ErrInvalidPrefix   = errors.New("prefix must match ^[a-zA-Z0-9_-]{0,32}$")
	ErrInvalidCount    = errors.New("count must be between 1 and 10")
	ErrUUIDRequires128 = errors.New("uuid format requires 128 bits")
)

type Key struct {
	Value  string
	Bits   int
	Format Format
	Level  Level
}

var allowedBits = map[int]struct{}{
	16: {}, 32: {}, 48: {}, 64: {}, 128: {}, 256: {},
}

func IsValidBits(bits int) bool {
	_, ok := allowedBits[bits]
	return ok
}

func LevelFor(bits int) Level {
	switch {
	case bits <= 32:
		return LevelWeak
	case bits <= 64:
		return LevelMedium
	default:
		return LevelHigh
	}
}
