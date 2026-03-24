package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mrsan/portfolio-api/internal/domain/featureflags"
)

type FeatureFlagHandler struct {
	svc *featureflags.Service
}

func NewFeatureFlagHandler(svc *featureflags.Service) *FeatureFlagHandler {
	return &FeatureFlagHandler{svc: svc}
}

func (h *FeatureFlagHandler) GetAll(c *gin.Context) {
	flags, err := h.svc.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch flags"})
		return
	}

	// Return as a map for easy frontend consumption: { "chatbot": true, "kofi_widget": false }
	result := make(map[string]bool)
	for _, f := range flags {
		result[f.Key] = f.Enabled
	}
	c.JSON(http.StatusOK, result)
}

type toggleRequest struct {
	Key     string `json:"key" binding:"required"`
	Enabled bool   `json:"enabled"`
}

func (h *FeatureFlagHandler) Toggle(c *gin.Context) {
	var req toggleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.svc.Toggle(c.Request.Context(), req.Key, req.Enabled); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update flag"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"key": req.Key, "enabled": req.Enabled})
}
