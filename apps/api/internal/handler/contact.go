package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mrsan/portfolio-api/internal/domain/contact"
)

type ContactHandler struct {
	svc             *contact.Service
	turnstileSecret string
}

func NewContactHandler(svc *contact.Service, turnstileSecret string) *ContactHandler {
	return &ContactHandler{svc: svc, turnstileSecret: turnstileSecret}
}

type contactRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required"`
	ProjectType    string `json:"projectType"`
	Maturity       string `json:"maturity"`
	Timeline       string `json:"timeline"`
	Message        string `json:"message" binding:"required"`
	TurnstileToken string `json:"turnstileToken" binding:"required"`
}

func (h *ContactHandler) Submit(c *gin.Context) {
	var req contactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify Turnstile token
	if h.turnstileSecret != "" {
		if !verifyTurnstile(h.turnstileSecret, req.TurnstileToken, c.ClientIP()) {
			c.JSON(http.StatusForbidden, gin.H{"error": "captcha verification failed"})
			return
		}
	}

	r := &contact.Request{
		Name:        strings.TrimSpace(req.Name),
		Email:       strings.TrimSpace(req.Email),
		ProjectType: req.ProjectType,
		Maturity:    req.Maturity,
		Timeline:    req.Timeline,
		Message:     strings.TrimSpace(req.Message),
	}

	if err := h.svc.Submit(c.Request.Context(), r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "request submitted"})
}

func (h *ContactHandler) GetAll(c *gin.Context) {
	result, err := h.svc.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch requests"})
		return
	}
	if result == nil {
		result = []contact.Request{}
	}
	c.JSON(http.StatusOK, result)
}

func (h *ContactHandler) MarkRead(c *gin.Context) {
	id := c.Param("id")
	if err := h.svc.MarkRead(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to mark as read"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "marked as read"})
}

type turnstileResponse struct {
	Success bool `json:"success"`
}

func verifyTurnstile(secret, token, remoteIP string) bool {
	resp, err := http.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", map[string][]string{
		"secret":   {secret},
		"response": {token},
		"remoteip": {remoteIP},
	})
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	var result turnstileResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false
	}
	return result.Success
}
