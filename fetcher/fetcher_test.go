package fetcher

//func TestFetcher(t *testing.T) {
//	fetchArgs := &FetchArgs{
//		Url: "https://jira.garenanow.com/browse/SPDGT-951?jql=project%20%3D%20SPDGT%20AND%20resolution%20%3D%20Unresolved%20AND%20component%20%3D%20FE%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC",
//		Method: "GET",
//		Body: nil,
//		AddHeaders: func(r *http.Request) {
//			r.Header.Set("Cookie", "JSESSIONID=DD4BF1A7A863F114CB1DC8AAD530083D; seraph.rememberme.cookie=17248%3A0dcb1b5f329455dc5212a32922c64a43b3588e8e; atlassian.xsrf.token=BL7Y-EY4L-FQH4-PD1I_c08385f256392ed78a85c5e39323e00cde7fa618_lin")
//		},
//	}
//
//	resp, _ := Fetch(fetchArgs)
//	fmt.Printf("%s", resp)
//}