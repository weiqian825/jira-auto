package parser

import (
	"github.com/PuerkitoBio/goquery"
	"jira-auto/model"
	"jira-auto/types"
	"strings"
)

func getText(doc *goquery.Document, sel string) string {
	return strings.TrimSpace(doc.Find(sel).Text())
}

func ParseJiraDetail(doc *goquery.Document, url string) types.ParseResult {
	result := types.ParseResult{}

	title := getText(doc, "#summary-val")
	_type := getText(doc, "#type-val")
	assignTo := getText(doc, "#assignee-val .user-hover")
	reportTo := getText(doc, "#reporter-val .user-hover")
	createTime := getText(doc, "#created-val .livestamp")
	updateTime := getText(doc, "#updated-val .livestamp")

	jira := model.Jira{
		title,
		_type,
		assignTo,
		reportTo,
		createTime,
		updateTime,
	}

	result.Items = []types.Item{{
		url,
		jira,
	}}

	return result
}
