package scheduler

import "jira-auto/engine"


type Scheduler struct {
	requestChan chan engine.Request
}

func (s *Scheduler) Submit(r engine.Request) {
	go func() {
		s.requestChan <- r
	}()
}

func (s *Scheduler) Configure(c chan engine.Request) {
	s.requestChan = c
}