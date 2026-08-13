package email

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer/templates"
)

type EmailService interface {
	SendWelcomeEmail(to, name string) error
	SendInvitationEmail(to, name, tenantName, acceptURL string) error
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

// SendInvitationEmail fires the invite-a-member email asynchronously. The
// raw token is never logged or persisted server-side; it travels only in
// this URL and lands in the invitee's inbox.
func (e *emailService) SendInvitationEmail(to, name, tenantName, acceptURL string) error {
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
