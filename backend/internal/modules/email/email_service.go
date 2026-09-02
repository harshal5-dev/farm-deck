package email

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer/templates"
)

type MailService interface {
	SendWelcomeEmail(to, name string) error
	SendInvitationEmail(to, name, tenantName, acceptURL string) error
}

type MailServiceImpl struct {
	cfg    config.Config
	mailer *mailer.AsyncMailer
}

func NewEmailService(cfg config.Config, mailer *mailer.AsyncMailer) MailService {
	return &MailServiceImpl{cfg: cfg, mailer: mailer}
}

func (e *MailServiceImpl) SendWelcomeEmail(to, name string) error {
	messageInfo, err := templates.WelcomeMessage(to, templates.Welcome{Name: name, AppURL: e.cfg.AppURL})
	if err != nil {
		return err
	}

	e.mailer.SendAsync(messageInfo)
	return nil
}

func (e *MailServiceImpl) SendInvitationEmail(to, name, tenantName, acceptURL string) error {
	messageInfo, err := templates.InvitationMessage(to, templates.Invitation{
		Name:       name,
		TenantName: tenantName,
		AcceptURL:  acceptURL,
		AppURL:     e.cfg.AppURL,
	})
	if err != nil {
		return err
	}

	e.mailer.SendAsync(messageInfo)
	return nil
}
