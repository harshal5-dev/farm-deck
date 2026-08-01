package email

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer/templates"
)

type EmailService interface {
	SendWelcomeEmail(string, string) error
}

type emailService struct {
	cfg    config.Config
	mailer *mailer.AsyncMailer
}

func NewEmailService(cfg config.Config, mailer *mailer.AsyncMailer) EmailService {
	return &emailService{cfg: cfg, mailer: mailer}
}

func (e *emailService) SendWelcomeEmail(to, name string) error {
	messageInfo, err := templates.WelcomeMessage(to, templates.Welcome{Name: name, AppURL: e.cfg.AppURL})
	if err != nil {
		return err
	}

	e.mailer.SendAsync(messageInfo)
	return nil
}
