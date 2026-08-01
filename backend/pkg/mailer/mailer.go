package mailer

import "context"

type Attachment struct {
	Content     []byte
	Filename    string
	ContentType string
	ContentID   string
}

type Message struct {
	To          []string
	Subject     string
	HTML        string
	Text        string
	ReplyTo     string
	Attachments []Attachment
}

type Mailer interface {
	Send(ctx context.Context, msg Message) error
}
