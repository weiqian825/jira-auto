package parser

import (
	"github.com/PuerkitoBio/goquery"
	"jira-auto/spider/engine"
	"jira-auto/spider/types"
)

func ParseJiraList(doc *goquery.Document) types.ParseResult {
	result := types.ParseResult{}

	//doc.Find(".pagination").Each(func(i int, selection *goquery.Selection) {
	//	fmt.Println("--------------------------")
	//	fmt.Println(selection.Html())
	//})

	links := doc.Find(".splitview-issue-link")
	number := links.Length()

	if number == 50 {
		engine.GlobalSearch.AddIndex(50)
	}

	nextPageUrl := engine.NewUrl()
	result.Requests = append(result.Requests, types.Request{
		Url:        nextPageUrl,
		ParserFunc: ParseJiraList,
	})

	links.Each(func(i int, selection *goquery.Selection) {
		href, _ := selection.Attr("href")
		url := "https://jira.garenanow.com" + href
		result.Requests = append(result.Requests, types.Request{
			Url: url,
			ParserFunc: func(document *goquery.Document) types.ParseResult {
				return ParseJiraDetail(document, url)
			},
		})
	})

	return result
}
