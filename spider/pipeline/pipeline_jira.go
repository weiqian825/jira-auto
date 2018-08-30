package pipeline

import (
	"fmt"
	"io"
	"jira-auto/spider/model"
	"jira-auto/spider/types"
	"log"
	"os"
	"sync"
)

type PipelineJira struct {
	File *os.File
	mux  sync.Mutex
}

func NewPipelineJira(filename string) (*PipelineJira, error) {
	f, err := os.Create(filename) //创建文件
	if err != nil {
		return nil, err
	}
	f.WriteString("\xEF\xBB\xBF")
	var mux sync.Mutex
	return &PipelineJira{f, mux}, nil
}

func (this *PipelineJira) Close() {
	log.Println("Close PipelineJira")
	this.File.Close()
}

func (this *PipelineJira) Process(item types.Item) {
	//this.mux.Lock()
	//defer this.mux.Unlock()

	if jira, ok := item.Payload.(model.Jira); ok {
		//lineStr := fmt.Sprintf("%s\t%s\t%s\t%s\t%s\t%s\t%s\n", item.Url, jira.Title, jira.Type, jira.AssignTo, jira.ReportTo, jira.CreateTime, jira.UpdateTime)
		lineStr := fmt.Sprintf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n", item.Url, jira.Title, jira.Type, jira.AssignTo, jira.ReportTo, jira.CreateTime, jira.UpdateTime)
		io.WriteString(this.File, lineStr)
	}
}
