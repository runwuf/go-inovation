//go:build ebitencbackend
// +build ebitencbackend

package main

import "C"

//export GoMain
func GoMain() {
	main()
}
