package pipeline

import "jira-auto/spider/types"

type Pipeline interface {
	Process(item types.Item)
	Close()
}
