package queries

import (
	"context"
	"errors"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type UpdateZoneTxResult struct {
	Zone            Zone
	ZoneSoilDetail  ZoneSoilDetail
	ZoneHydroDetail ZoneHydroDetail
}

func (store *SQLStore) UpdateZoneTx(ctx context.Context, arg domain.ManageZoneTxParams) (UpdateZoneTxResult, error) {
	var result UpdateZoneTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		result.Zone, err = q.UpdateZone(ctx, UpdateZoneParams{
			ID:       arg.ID,
			Name:     arg.Name,
			Area:     arg.Area,
			AreaUnit: arg.AreaUnit,
			Notes:    arg.Notes,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return domain.ErrDuplicateZoneName
			}
			return err
		}

		switch arg.ZoneTypeName {
		case domain.ZoneTypeSoil:
			result.ZoneSoilDetail, err = q.UpdateZoneSoilDetails(ctx, UpdateZoneSoilDetailsParams{
				ZoneID:     result.Zone.ID,
				SoilTypeID: arg.SoilTypeID,
			})
			if err != nil {
				return err
			}
		case domain.ZoneTypeHydro:
			result.ZoneHydroDetail, err = q.UpdateZoneHydroDetails(ctx, UpdateZoneHydroDetailsParams{
				ZoneID:                result.Zone.ID,
				HydroSystemTypeID:     arg.HydroSystemTypeID,
				NumberOfSlots:         arg.NumberOfSlots,
				ReservoirVolumeLiters: arg.ReservoirVolumeLiters,
				GrowMedium:            arg.GrowMedium,
			})
			if err != nil {
				return err
			}
		}

		return nil
	})
	return result, err
}
