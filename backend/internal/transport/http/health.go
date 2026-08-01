package httptransport

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthResponse is the body returned by the health endpoint.
type HealthResponse struct {
	Status  string `json:"status" example:"ok"`
	Service string `json:"service" example:"workspace-hub-server"`
}

// healthCheck godoc
// @Summary      Liveness check
// @Description  Returns the service status. Does not require authentication.
// @Tags         health
// @Produce      json
// @Success      200 {object} HealthResponse "service is healthy"
// @Router       /health [get]
func (server *Server) healthCheck(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, HealthResponse{
		Status:  "ok",
		Service: "workspace-hub-server",
	})
}
