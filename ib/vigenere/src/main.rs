use std::fs::File;
use std::io::{stdin, Read, Result, Write};
use std::path::Path;

const ALPHABET: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789!@#$%^&*()-_=+[]{}\\|;:'\"<>,.?/~` ";

fn find_char_position(target: char) -> Option<usize> {
    for (index, ch) in ALPHABET.chars().enumerate() {
        if ch == target {
            return Some(index);
        }
    }
    None
}

fn vigenere_encrypt(text: &str, key: &str) -> String {
    let key_len = key.chars().count();
    let mut encrypted = String::new();
    for (i, c) in text.chars().enumerate() {
        if let Some(text_index) = find_char_position(c) {
            let key_char = key.chars().nth(i % key_len).unwrap();
            if let Some(key_index) = find_char_position(key_char) {
                let new_index = (text_index + key_index) % ALPHABET.chars().count();
                println!(
                    "{},{},{},{},{}",
                    c,
                    text_index,
                    key_index,
                    new_index,
                    ALPHABET.chars().nth(new_index).unwrap()
                );

                encrypted.push(ALPHABET.chars().nth(new_index).unwrap());
            } else {
                encrypted.push(c);
            }
        } else {
            encrypted.push(c);
        }
    }

    encrypted
}

fn vigenere_decrypt(text: &str, key: &str) -> String {
    let key_len = key.chars().count();
    let mut decrypted = String::new();

    for (i, c) in text.chars().enumerate() {
        if let Some(text_index) = find_char_position(c) {
            let key_char = key.chars().nth(i % key_len).unwrap();
            if let Some(key_index) = find_char_position(key_char) {
                let new_index =
                    (text_index + ALPHABET.chars().count() - key_index) % ALPHABET.chars().count();
                println!(
                    "{},{},{},{},{}",
                    c,
                    text_index,
                    key_index,
                    new_index,
                    ALPHABET.chars().nth(new_index).unwrap()
                );
                decrypted.push(ALPHABET.chars().nth(new_index).unwrap());
            } else {
                decrypted.push(c);
            }
        } else {
            decrypted.push(c);
        }
    }

    decrypted
}

fn encrypt_file(input_path: &Path, output_path: &Path, key: &str) -> Result<()> {
    let mut input_file = File::open(input_path)?;
    let mut input_text = String::new();
    input_file.read_to_string(&mut input_text)?;

    let encrypted_text = vigenere_encrypt(&input_text, key);

    let mut output_file = File::create(output_path)?;
    output_file.write_all(encrypted_text.as_bytes())?;

    Ok(())
}

fn decrypt_file(input_path: &Path, output_path: &Path, key: &str) -> Result<()> {
    let mut input_file = File::open(input_path)?;
    let mut input_text = String::new();
    input_file.read_to_string(&mut input_text)?;

    let decrypted_text = vigenere_decrypt(&input_text, key);

    let mut output_file = File::create(output_path)?;
    output_file.write_all(decrypted_text.as_bytes())?;

    Ok(())
}

fn read_input(prompt: &str) -> Result<String> {
    println!("{}", prompt);
    let mut input = String::new();
    stdin().read_line(&mut input)?;
    Ok(input.trim().to_string())
}

fn main() -> Result<()> {
    loop {
        let command = read_input("Введите команду\n1) - зашифровать\n2) - расшифровать")?;

        match command.as_str() {
            "1" => {
                let key = read_input("Введите ключ: ")?;
                if key.is_empty() {
                    println!("Ключ не может быть пустым");
                    continue;
                }

                let input_file = "input.txt";
                let encrypted_file = "encrypted.txt";

                if let Err(_) = encrypt_file(Path::new(input_file), Path::new(encrypted_file), &key)
                {
                    println!("Невозможно произвести шифрование файла input.txt");
                    continue;
                } else {
                    println!("Файл успешно зашифрован!");
                    break;
                }
            }
            "2" => {
                let key = read_input("Введите ключ: ")?;
                if key.is_empty() {
                    println!("Ключ не может быть пустым");
                    continue;
                }

                let encrypted_file = "encrypted.txt";
                let decrypted_file = "decrypted.txt";

                if let Err(_) =
                    decrypt_file(Path::new(encrypted_file), Path::new(decrypted_file), &key)
                {
                    println!("Невозможно расшифровать файл");
                    continue;
                } else {
                    println!("Создан файл decrypted.txt - расшифровка предоставленным ключом");
                    break;
                }
            }
            _ => {
                println!("Неверная команда, повторите ввод");
            }
        }
    }

    Ok(())
}
