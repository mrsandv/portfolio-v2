package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mrsan/portfolio-api/internal/domain/snippets"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type SnippetHandler struct {
	svc *snippets.Service
}

func NewSnippetHandler(svc *snippets.Service) *SnippetHandler {
	return &SnippetHandler{svc: svc}
}

func (h *SnippetHandler) GetAll(c *gin.Context) {
	result, err := h.svc.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch snippets"})
		return
	}
	if result == nil {
		result = []snippets.Snippet{}
	}
	c.JSON(http.StatusOK, result)
}

func (h *SnippetHandler) GetByCategory(c *gin.Context) {
	category := c.Param("category")
	result, err := h.svc.GetByCategory(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch snippets"})
		return
	}
	if result == nil {
		result = []snippets.Snippet{}
	}
	c.JSON(http.StatusOK, result)
}

func (h *SnippetHandler) GetCategories(c *gin.Context) {
	result, err := h.svc.GetCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch categories"})
		return
	}
	if result == nil {
		result = []string{}
	}
	c.JSON(http.StatusOK, result)
}

func (h *SnippetHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	s, err := h.svc.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "snippet not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch snippet"})
		return
	}
	c.JSON(http.StatusOK, s)
}

type createSnippetRequest struct {
	Title       string   `json:"title" binding:"required"`
	Slug        string   `json:"slug"`
	Code        string   `json:"code" binding:"required"`
	Language    string   `json:"language" binding:"required"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
}

type updateSnippetRequest struct {
	Title       *string  `json:"title"`
	Code        *string  `json:"code"`
	Language    *string  `json:"language"`
	Category    *string  `json:"category"`
	Description *string  `json:"description"`
	Tags        []string `json:"tags"`
}

func (h *SnippetHandler) Create(c *gin.Context) {
	var req createSnippetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	s := &snippets.Snippet{
		Title:       req.Title,
		Slug:        req.Slug,
		Code:        req.Code,
		Language:    req.Language,
		Category:    req.Category,
		Description: req.Description,
		Tags:        req.Tags,
	}

	if err := h.svc.Create(c.Request.Context(), s); err != nil {
		if mongo.IsDuplicateKeyError(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create snippet"})
		return
	}
	c.JSON(http.StatusCreated, s)
}

func (h *SnippetHandler) Update(c *gin.Context) {
	slug := c.Param("slug")

	existing, err := h.svc.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "snippet not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch snippet"})
		return
	}

	var req updateSnippetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Code != nil {
		existing.Code = *req.Code
	}
	if req.Language != nil {
		existing.Language = *req.Language
	}
	if req.Category != nil {
		existing.Category = *req.Category
	}
	if req.Description != nil {
		existing.Description = *req.Description
	}
	if req.Tags != nil {
		existing.Tags = req.Tags
	}

	if err := h.svc.Update(c.Request.Context(), slug, existing); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update snippet"})
		return
	}
	c.JSON(http.StatusOK, existing)
}

func (h *SnippetHandler) Delete(c *gin.Context) {
	slug := c.Param("slug")
	if err := h.svc.Delete(c.Request.Context(), slug); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete snippet"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *SnippetHandler) ToggleLike(c *gin.Context) {
	slug := c.Param("slug")
	ip := c.ClientIP()

	liked, likes, err := h.svc.ToggleLike(c.Request.Context(), slug, ip)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to toggle like"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"liked": liked, "likes": likes})
}

func (h *SnippetHandler) GetTopLiked(c *gin.Context) {
	result, err := h.svc.GetTopLiked(c.Request.Context(), 5)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch top snippets"})
		return
	}
	if result == nil {
		result = []snippets.Snippet{}
	}
	c.JSON(http.StatusOK, result)
}
