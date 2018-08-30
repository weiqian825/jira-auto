package pipeline

import "jira-auto/types"

type Pipeline interface {
	Process(item types.Item)
	Close()
}
