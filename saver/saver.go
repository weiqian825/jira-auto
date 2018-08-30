package saver

import (
	"jira-auto/engine"
	"log"
)

type Saver interface {
	Save(engine.Item) error
	Close()
}

func SaveItemFromChan(s Saver) (chan engine.Item, error) {
	itemChan := make(chan engine.Item)

	go func() {
		for {
			item, ok := <-itemChan

			if !ok {
				s.Close()
				break
			}

			err := s.Save(item)
			if err != nil {
				log.Println("Item Saver: error saving item %v: %v", item, err)
			}
		}
	}()

	return itemChan, nil
}
