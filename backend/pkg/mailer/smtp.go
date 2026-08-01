package mailer

import (
	"bytes"
	"context"
	"crypto/tls"
	"fmt"

	gomail "github.com/wneessen/go-mail"
)

type smtpMailer struct {
	host     string
	port     int
	username string
	password string
	from     string
}

func NewSMTPMailer(host string, port int, username, password, fromAddress string) Mailer {
	return &smtpMailer{
		host:     host,
		port:     port,
		username: username,
		password: password,
		from:     fromAddress,
	}
}

func (m *smtpMailer) Send(ctx context.Context, msg Message) error {
	gm := gomail.NewMsg()

	if err := gm.From(m.from); err != nil {
		return fmt.Errorf("mailer: invalid from address: %w", err)
	}
	if err := gm.To(msg.To...); err != nil {
		return fmt.Errorf("mailer: invalid to address: %w", err)
	}
	if msg.ReplyTo != "" {
		if err := gm.ReplyTo(msg.ReplyTo); err != nil {
			return fmt.Errorf("mailer: invalid reply-to address: %w", err)
		}
	}

	gm.Subject(msg.Subject)

	switch {
	case msg.Text != "" && msg.HTML != "":
		gm.SetBodyString(gomail.TypeTextPlain, msg.Text)
		gm.AddAlternativeString(gomail.TypeTextHTML, msg.HTML) // returns nothing in go-mail v0.8.x
	case msg.HTML != "":
		gm.SetBodyString(gomail.TypeTextHTML, msg.HTML)
	default:
		gm.SetBodyString(gomail.TypeTextPlain, msg.Text)
	}

	for _, a := range msg.Attachments {
		opts := []gomail.FileOption{
			gomail.WithFileName(a.Filename),
		}
		if a.ContentType != "" {
			opts = append(opts, gomail.WithFileContentType(gomail.ContentType(a.ContentType)))
		}
		if a.ContentID != "" {
			opts = append(opts, gomail.WithFileContentID(a.ContentID))
		}

		if err := gm.EmbedReader(a.Filename, bytes.NewReader(a.Content), opts...); err != nil {
			return fmt.Errorf("mailer: attach %s: %w", a.Filename, err)
		}
	}

	client, err := gomail.NewClient(
		m.host,
		gomail.WithPort(m.port),
		gomail.WithSMTPAuth(gomail.SMTPAuthPlain),
		gomail.WithUsername(m.username),
		gomail.WithPassword(m.password),
		gomail.WithTLSPolicy(gomail.TLSMandatory),
		gomail.WithTLSConfig(&tls.Config{ServerName: m.host, MinVersion: tls.VersionTLS12}),
	)
	if err != nil {
		return fmt.Errorf("mailer: smtp client init: %w", err)
	}

	if err := client.DialAndSendWithContext(ctx, gm); err != nil {
		return fmt.Errorf("mailer: smtp send failed: %w", err)
	}
	return nil
}
