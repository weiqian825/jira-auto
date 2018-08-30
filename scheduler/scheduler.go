package scheduler

import "jira-auto/types"

type Scheduler interface {
	Push(req *types.Request)
	Poll() *types.Request
}
