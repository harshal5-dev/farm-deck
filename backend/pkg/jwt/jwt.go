package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type CustomClaims struct {
	UserId   uuid.UUID `json:"userId"`
	TenantId uuid.UUID `json:"tenantId"`
	jwt.RegisteredClaims
}

type UserDetails struct {
	UserId   uuid.UUID
	TenantId uuid.UUID
}

type JwtConfig struct {
	AccessTokenDuration time.Duration
	Issuer              string
	JWTSecret           string
}

func GenerateToken(user UserDetails, jwtCfg JwtConfig) (string, error) {
	secretKey := []byte(jwtCfg.JWTSecret)
	claims := CustomClaims{
		UserId:   user.UserId,
		TenantId: user.TenantId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(jwtCfg.AccessTokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    jwtCfg.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func VerifyToken(tokenString string, jwtSecret string) (*CustomClaims, error) {
	secretKey := []byte(jwtSecret)
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (any, error) {
		// Validate the signing algorithm
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}
