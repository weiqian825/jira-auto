package main

import (
	"flag"
	"jira-auto/engine"
	"jira-auto/fetcher"
	"jira-auto/parser"
	"jira-auto/saver"
	"net/http"
	"os/user"
)

var (
	issuetype  = flag.String("issuetype", "Task, Sub-task", "jira类型")
	resolution = flag.String("resolution", "Unresolved, Done", "解决结果")
	assignee   = flag.String("assignee", "", "经办人")
	component  = flag.String("component", "FE", "模块，默认为 FE")
	cookie     = flag.String("cookie", "", "从浏览器复制cookie到这里")
)

func main() {
	flag.Parse()

	engine.InitSearch(engine.Search{*issuetype, *resolution, *component, *assignee, 0})
	url := engine.NewUrl()

	fetcher := fetcher.Fetcher{
		"GET",
		func(r *http.Request) {
			r.Header.Set("Cookie", *cookie)
		},
	}

	myself, error := user.Current()
	if error != nil {
		panic(error)
	}
	homedir := myself.HomeDir
	desktop := homedir + "/Desktop/data.csv"

	jiraSaver, err := saver.NewJiraSaver(desktop)
	if err != nil {
		panic(err)
	}

	itemChan, err := saver.SaveItemFromChan(jiraSaver)
	if err != nil {
		panic(err)
	}

	e := engine.SimpleEngine{
		Fetcher:     fetcher,
		ItemChan:    itemChan,
		DoneChan:    jiraSaver.DoneChan,
		Deduplicate: engine.NewSimpleDeDuplicate(),
	}

	e.Run(engine.Request{
		Url:        url,
		ParserFunc: parser.ParseJiraList,
	})
}
