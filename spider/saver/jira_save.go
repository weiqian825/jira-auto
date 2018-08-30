package saver

import (
	"fmt"
	"io"
	"jira-auto/spider/engine"
	"jira-auto/spider/model"
	"log"
	"os"
)

type JiraSaver struct {
	File     *os.File
	DoneChan chan bool
}

func NewJiraSaver(filename string) (*JiraSaver, error) {
	f, err := os.Create(filename) //创建文件
	if err != nil {
		return nil, err
	}
	f.WriteString("\xEF\xBB\xBF")
	return &JiraSaver{f, make(chan bool)}, nil
}

func (s *JiraSaver) Save(item engine.Item) error {
	if jira, ok := item.Payload.(model.Jira); ok {
		//lineStr := fmt.Sprintf("%s\t%s\t%s\t%s\t%s\t%s\t%s\n", item.Url, jira.Title, jira.Type, jira.AssignTo, jira.ReportTo, jira.CreateTime, jira.UpdateTime)
		lineStr := fmt.Sprintf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n", item.Url, jira.Title, jira.Type, jira.AssignTo, jira.ReportTo, jira.CreateTime, jira.UpdateTime)
		io.WriteString(s.File, lineStr)
	}
	return nil
}

func (s *JiraSaver) Close() {
	log.Println("Close JiraSaver")
	s.File.Close()
	s.DoneChan <- true
}
