package scheduler

import (
	"jira-auto/types"
)

type SimpleScheduler struct {
	queue chan *types.Request
}

func NewSimpleScheduler(size int) *SimpleScheduler {
	if size == 0 {
		size = 1024
	}
	ch := make(chan *types.Request, size)
	return &SimpleScheduler{ch}
}

func (s *SimpleScheduler) Push(req *types.Request) {
	s.queue <- req
}

func (s *SimpleScheduler) Poll() *types.Request {
	if len(s.queue) == 0 {
		return nil
	} else {
		return <-s.queue
	}
}
