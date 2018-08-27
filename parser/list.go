package parser

import (
	"jira-auto/engine"
	"github.com/PuerkitoBio/goquery"
)

func ParseJiraList(doc *goquery.Document) engine.ParseResult {
	result := engine.ParseResult{}


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
	result.Requests = append(result.Requests, engine.Request{
		Url: nextPageUrl,
		ParserFunc: ParseJiraList,
	})

	links.Each(func(i int, selection *goquery.Selection) {
		href, _ := selection.Attr("href")
		url := "https://jira.garenanow.com" + href
		result.Requests = append(result.Requests, engine.Request{
			Url: url,
			ParserFunc: func(document *goquery.Document) engine.ParseResult {
				return ParseJiraDetail(document, url)
			},
		})
	})

	return result
}