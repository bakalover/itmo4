package main

import (
	"fmt"
	"strings"
	"unicode"
)

func main() {
	message := "Привет, мир!"
	keyword := "ключ"

	encrypted := vigenereEncrypt(message, keyword)
	fmt.Println("Encrypted:", encrypted)

	decrypted := vigenereDecrypt(encrypted, keyword)
	fmt.Println("Decrypted:", decrypted)
}

func vigenereEncrypt(message, keyword string) string {
	var encrypted strings.Builder
	keyIndex := 0
	keyRunes := []rune(keyword)

	for _, char := range message {
		if unicode.IsLetter(char) {
			shift := getShift(keyRunes[keyIndex%len(keyRunes)])
			encrypted.WriteRune(shiftChar(char, shift))
			keyIndex++
		} else {
			encrypted.WriteRune(char)
		}
	}

	return encrypted.String()
}

func vigenereDecrypt(message, keyword string) string {
	var decrypted strings.Builder
	keyIndex := 0
	keyRunes := []rune(keyword)

	for _, char := range message {
		if unicode.IsLetter(char) {
			shift := getShift(keyRunes[keyIndex%len(keyRunes)])
			decrypted.WriteRune(shiftChar(char, -shift))
			keyIndex++
		} else {
			decrypted.WriteRune(char)
		}
	}

	return decrypted.String()
}

func getShift(char rune) int {
	if char >= 'a' && char <= 'z' {
		return int(char - 'a')
	} else if char >= 'A' && char <= 'Z' {
		return int(char - 'A')
	} else if char >= 'а' && char <= 'я' {
		return int(char - 'а')
	} else if char >= 'А' && char <= 'Я' {
		return int(char - 'А')
	}
	return 0
}

func shiftChar(char rune, shift int) rune {
	if char >= 'a' && char <= 'z' {
		return 'a' + (char-'a'+rune(shift)+26)%26
	} else if char >= 'A' && char <= 'Z' {
		return 'A' + (char-'A'+rune(shift)+26)%26
	} else if char >= 'а' && char <= 'я' {
		return 'а' + (char-'а'+rune(shift)+32)%32
	} else if char >= 'А' && char <= 'Я' {
		return 'А' + (char-'А'+rune(shift)+32)%32
	}
	return char
}
