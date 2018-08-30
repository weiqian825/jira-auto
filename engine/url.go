package engine

import (
	"fmt"
	"net/url"
)

type Search struct {
	IssueType  string
	Resolution string
	Component  string
	Assignee   string
	StartIndex int
}

func (s *Search) AddIndex(n int) {
	s.StartIndex += n
}

var GlobalSearch Search

func InitSearch(search Search) {
	GlobalSearch = search
}

func NewUrl() string {
	s := " = SPDGT AND issuetype in (" + GlobalSearch.IssueType + ") AND resolution in (" + GlobalSearch.Resolution + ") AND component = " + GlobalSearch.Component
	if GlobalSearch.Assignee != "" {
		s = s + " AND assignee in (\"" + GlobalSearch.Assignee + "\")"
	}
	s = s + " Order By priority DESC, created DESC"

	return "https://jira.garenanow.com/issues/?jql=project" + url.QueryEscape(s) + "&startIndex=" + fmt.Sprintf("%d", GlobalSearch.StartIndex)
}
