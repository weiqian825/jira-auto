package engine

import "github.com/PuerkitoBio/goquery"

type Request struct {
	Url        string
	ParserFunc func(document *goquery.Document) ParseResult
}

type ParseResult struct {
	Requests []Request
	Items    []Item
}

type Item struct {
	Url     string
	Payload interface{}
}

type Deduplicate interface {
	IsDuplicate(url string) bool
}
