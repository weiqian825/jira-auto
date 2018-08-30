package scheduler

import "jira-auto/spider/types"

type Scheduler interface {
	Push(req *types.Request)
	Poll() *types.Request
}
