package mappers

func Map[T any, R any](src *T, fn func(*T) *R) *R {
	if src == nil {
		return nil
	}
	return fn(src)
}

func MapSlice[T any, R any](src []T, fn func(*T) *R) []R {
	dst := make([]R, 0, len(src))

	for i := range src {
		if mapped := fn(&src[i]); mapped != nil {
			dst = append(dst, *mapped)
		}
	}

	return dst
}