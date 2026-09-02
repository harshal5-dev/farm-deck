package validate

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func init() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name, _, _ := strings.Cut(fld.Tag.Get("json"), ",")
			if name == "-" || name == "" {
				return fld.Name
			}
			return name
		})
	}
}

func Bind(ctx *gin.Context, req any) bool {
	if err := ctx.ShouldBindJSON(req); err != nil {
		if validationErrs, ok := errors.AsType[validator.ValidationErrors](err); ok {
			response.ValidationError(ctx, toFieldErrors(validationErrs))
			return false
		}
		response.BadRequest(ctx, bodyErrorMessage(err))
		return false
	}
	return true
}

func toFieldErrors(errs validator.ValidationErrors) []FieldError {
	fieldErrors := make([]FieldError, 0, len(errs))
	for _, err := range errs {
		fieldErrors = append(fieldErrors, FieldError{
			Field:   err.Field(),
			Message: tagMessage(err),
		})
	}
	return fieldErrors
}

func tagMessage(err validator.FieldError) string {
	field := err.Field()
	switch err.Tag() {
	case "required":
		return field + " is required"
	case "email":
		return field + " must be a valid email address"
	case "min":
		return fmt.Sprintf("%s must be at least %s %s", field, err.Param(), unit(err))
	case "max":
		return fmt.Sprintf("%s must be at most %s %s", field, err.Param(), unit(err))
	case "len":
		return fmt.Sprintf("%s must be exactly %s %s", field, err.Param(), unit(err))
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", field, strings.ReplaceAll(err.Param(), " ", ", "))
	case "uuid":
		return field + " must be a valid UUID"
	case "url":
		return field + " must be a valid URL"
	case "alphanum":
		return field + " must contain only letters and numbers"
	default:
		return field + " is invalid"
	}
}

func unit(err validator.FieldError) string {
	switch err.Kind() {
	case reflect.String:
		return "characters"
	case reflect.Slice, reflect.Map, reflect.Array:
		return "items"
	default:
		return ""
	}
}

func bodyErrorMessage(err error) string {
	var syntaxErr *json.SyntaxError
	if errors.As(err, &syntaxErr) {
		return "request body contains invalid JSON"
	}

	var typeErr *json.UnmarshalTypeError
	if errors.As(err, &typeErr) {
		return fmt.Sprintf("field %q must be of type %s", typeErr.Field, typeErr.Type.String())
	}

	if errors.Is(err, io.EOF) {
		return "request body is required"
	}

	return "invalid request body"
}
