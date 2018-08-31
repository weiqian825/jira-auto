package engine

import (
	"jira-auto/spider/deduplicate"
	"jira-auto/spider/fetcher"
	"jira-auto/spider/pipeline"
	"jira-auto/spider/scheduler"
	"jira-auto/spider/types"
	"log"
	"sync"
	"time"
)

type SimpleEngine struct {
	Fetcher     fetcher.Fetcher
	Pipelines   []pipeline.Pipeline
	Scheduler   scheduler.Scheduler
	Deduplicate deduplicate.Deduplicate
}

func (e *SimpleEngine) Run(seeds ...types.Request) {
	var wg sync.WaitGroup
	var lastRequestTime time.Time

	for _, r := range seeds {
		e.Scheduler.Push(&r)
	}

	for {
		r := e.Scheduler.Poll()

		if r == nil {
			if time.Now().Sub(lastRequestTime).Seconds() > 3 {
				break
			}
			//if (time.Now().Sub(lastRequestTime))
			time.Sleep(100 * time.Millisecond)
			continue
		}

		lastRequestTime = time.Now()

		wg.Add(1)
		go func(r types.Request) {
			e.processRequest(r)
			wg.Done()
		}(*r)
	}
	wg.Wait()
	e.close()
}

func (e *SimpleEngine) close() {
	for _, p := range e.Pipelines {
		p.Close()
	}
}

func (e *SimpleEngine) processRequest(r types.Request) {
	log.Printf("Fetching %s", r.Url)
	doc := e.Fetcher.Fetch(r.Url)
	result := r.ParserFunc(doc)

	for _, r := range result.Requests {
		_r := r
		if !e.Deduplicate.IsDuplicate(r.Url) {
			e.Scheduler.Push(&_r)
		}
	}

	for _, item := range result.Items {
		log.Printf("Got item %v", item)
		for _, p := range e.Pipelines {
			p.Process(item)
		}
	}
}
