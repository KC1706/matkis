package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"matkis-assignment/backend/internal/search"
)

type SearchHandler struct {
	searchService *search.SearchService
}

func NewSearchHandler(searchService *search.SearchService) *SearchHandler {
	return &SearchHandler{
		searchService: searchService,
	}
}

func (h *SearchHandler) SearchUsers(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query parameter 'q' is required"})
		return
	}

	limit := 100 // Maximum results for search
	results, err := h.searchService.SearchUsers(c.Request.Context(), query, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Format response as requested
	formattedResults := make([]gin.H, len(results))
	for i, result := range results {
		formattedResults[i] = gin.H{
			"global_rank": result.GlobalRank,
			"username":    result.Username,
			"rating":      result.Rating,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data": formattedResults,
	})
}
