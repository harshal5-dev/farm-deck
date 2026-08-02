package auth

import (
	"errors"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/jackc/pgx/v5"
)

type dbUser = db.User

func userFromRefresh(t db.RefreshToken) dbUser {
	return dbUser{ID: t.UserID}
}

func toRotateParams(old db.RefreshToken, newHash string, meta SessionMeta, ttl time.Duration) db.RotateRefreshTokenTxParams {
	ua, ip := stringPtr(meta.UserAgent), stringPtr(meta.IP)
	return db.RotateRefreshTokenTxParams{
		OldTokenHash: tHash(old),
		NewTokenHash: newHash,
		NewExpiresAt: time.Now().Add(ttl),
		UserID:       old.UserID,
		UserAgent:    ua,
		Ip:           ip,
	}
}

func dbCreateRefreshTokenParams(userID uuid.UUID, hash string, ttl time.Duration, ua, ip *string) db.CreateRefreshTokenParams {
	return db.CreateRefreshTokenParams{
		UserID:    userID,
		TokenHash: hash,
		ExpiresAt: time.Now().Add(ttl),
		UserAgent: ua,
		Ip:        ip,
	}
}

func tHash(t db.RefreshToken) string { return t.TokenHash }

func pgxNoRows(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return pgx.ErrNoRows
	}
	return err
}
