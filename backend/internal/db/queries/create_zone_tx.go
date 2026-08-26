package queries

import (
	"context"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

type CreateZoneTxResult struct {
	Zone            Zone
	ZoneSoilDetail  ZoneSoilDetail
	ZoneHydroDetail ZoneHydroDetail
}

func (store *SQLStore) CreateZoneTx(ctx context.Context, arg domain.CreateZoneTxParams) (CreateZoneTxResult, error) {
	var result CreateZoneTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		result.Zone, err = q.CreateZone(ctx, CreateZoneParams{
			FarmID:     arg.FarmID,
			TenantID:   arg.TenantID,
			ZoneTypeID: arg.ZoneTypeID,
			Name:       arg.Name,
			Area:       arg.Area,
			AreaUnit:   arg.AreaUnit,
			Notes:      arg.Notes,
		})
		if err != nil {
			return err
		}

		switch arg.ZoneTypeName {
		case domain.ZoneTypeSoil:
			result.ZoneSoilDetail, err = q.CreateZoneSoilDetails(ctx, CreateZoneSoilDetailsParams{
				ZoneID:     result.Zone.ID,
				SoilTypeID: arg.SoilTypeID,
			})
			if err != nil {
				return err
			}
		case domain.ZoneTypeHydro:
			result.ZoneHydroDetail, err = q.CreateZoneHydroDetails(ctx, CreateZoneHydroDetailsParams{
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
