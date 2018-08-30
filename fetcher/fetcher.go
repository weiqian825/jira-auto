package fetcher

import (
	"bufio"
	"log"
	"net/http"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html/charset"
	"golang.org/x/text/encoding"
	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

func determineEncoding(r *bufio.Reader) encoding.Encoding {
	bytes, err := r.Peek(1024)
	if err != nil {
		log.Panicf("Fetcher error: %s", err)
		return unicode.UTF8
	}
	e, _, _ := charset.DetermineEncoding(bytes, "")
	return e
}

type Fetcher struct {
	Method     string
	AddHeaders func(r *http.Request)
}

// Fetch fetch body from url
func (f *Fetcher) Fetch(url string) *goquery.Document {
	client := &http.Client{}
	req, err := http.NewRequest(f.Method, url, nil)
	if err != nil {
		return nil
	}

	if f.AddHeaders != nil {
		f.AddHeaders(req)
	}

	resp, err := client.Do(req)
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil // fmt.Errorf("wrong status code: %d", resp.StatusCode)
	}

	bodyReader := bufio.NewReader(resp.Body)
	e := determineEncoding(bodyReader)
	utf8Reader := transform.NewReader(bodyReader, e.NewDecoder())

	//cont, _ := ioutil.ReadAll(utf8Reader)
	//fmt.Printf("%s", cont)

	doc, err := goquery.NewDocumentFromReader(utf8Reader)
	if err != nil {
		log.Println(err)
		return nil
	}
	return doc // ioutil.ReadAll(utf8Reader)
}
