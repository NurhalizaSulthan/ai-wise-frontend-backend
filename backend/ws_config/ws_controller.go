package websocketutils

import (
	"fmt"
	"log"

	"net/url"

	"github.com/gofiber/contrib/v3/websocket"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type WSController struct {
	hub *Hub
}

func NewWSController(hub *Hub) *WSController {
	return &WSController{hub: hub}
}

// HandleSession godoc
// @Summary      WebSocket session monitor
// @Description  Connect via WebSocket to monitor live telemetry for a boiling session
// @Tags         WebSocket
// @Param        mac_address path string true "alamat mac perangkat"
// @Router       /api/v1/ws/mobile/{mac_address} [get]
func (wc *WSController) HandleSession(c fiber.Ctx) error {
	if !websocket.IsWebSocketUpgrade(c) {
		return fiber.ErrUpgradeRequired
	}
	return c.Next()
}

func (wc *WSController) HandleSessionWS(c *websocket.Conn) {
	macAddressStr := c.Params("mac_address")
	decodeMacAddress, err := url.PathUnescape(macAddressStr)

	if err != nil {
		log.Printf("WS invalid mac_address: node decoded %s", macAddressStr)
		c.Close()
		return
	}

	if decodeMacAddress == "" {
		log.Printf("WS invalid mac_address: %s", decodeMacAddress)
		c.Close()
		return
	}

	pubID := uuid.New()
	sessionRegistration := fmt.Sprintf("%s+%s", decodeMacAddress, pubID)

	wc.hub.Register(sessionRegistration, c)
	defer wc.hub.Unregister(sessionRegistration, c)

	log.Printf("WS client connected to session %s", sessionRegistration)

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			log.Printf("WS client disconnected from session %s: %v", sessionRegistration, err)
			break
		}
	}
}
