use std::{
    fs::File,
    io::{Read, Result, Write},
};

const IP: [u8; 64] = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61,
    53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
];

const FP: [u8; 64] = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25,
];

const PC1: [u8; 56] = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60,
    52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4,
];

const PC2: [u8; 48] = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52,
    31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32,
];

const E: [u8; 48] = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18,
    19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1,
];

const SBOX: [[[u8; 16]; 4]; 8] = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
];

const P: [u8; 32] = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19,
    13, 30, 6, 22, 11, 4, 25,
];

const SHIFTS: [u8; 16] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

fn permute(input: u64, table: &[u8], size: usize) -> u64 {
    let mut output = 0;
    for (i, &index) in table.iter().enumerate() {
        let bit = (input >> (size - index as usize)) & 1;
        output |= bit << (size - 1 - i);
    }
    output
}

fn generate_round_keys(key: u64) -> [u64; 16] {
    let mut round_keys = [0u64; 16];
    let permuted_key = permute(key, &PC1, 64);

    let mut c = (permuted_key >> 28) & 0xFFFFFFF;
    let mut d = permuted_key & 0xFFFFFFF;

    for i in 0..16 {
        c = (c << SHIFTS[i] | c >> (28 - SHIFTS[i])) & 0xFFFFFFF;
        d = (d << SHIFTS[i] | d >> (28 - SHIFTS[i])) & 0xFFFFFFF;

        let cd = (c as u64) << 28 | d as u64;
        round_keys[i] = permute(cd, &PC2, 56);
    }

    round_keys
}

fn f(r: u64, k: u64) -> u64 {
    let expanded_r = permute(r, &E, 48);
    let xored = expanded_r ^ k;

    let mut sbox_output = 0;
    for i in 0..8 {
        let idx = (xored >> (42 - i * 6)) & 0x3F;
        let row = ((idx & 0x20) >> 4) | (idx & 0x01);
        let col = (idx & 0x1E) >> 1;
        sbox_output |= (SBOX[i as usize][row as usize][col as usize] as u64) << (32 - (i + 1) * 4);
    }

    permute(sbox_output, &P, 32)
}

fn des_encrypt(block: u64, key: u64) -> u64 {
    let permuted_block = permute(block, &IP, 64);
    let mut l = (permuted_block >> 32) & 0xFFFFFFFF;
    let mut r = permuted_block & 0xFFFFFFFF;

    let round_keys = generate_round_keys(key);

    for i in 0..16 {
        let temp = r;
        r = l ^ f(r, round_keys[i]);
        l = temp;
    }

    let rl = (r << 32) | l;
    permute(rl, &FP, 64)
}

fn des_decrypt(block: u64, key: u64) -> u64 {
    let permuted_block = permute(block, &IP, 64);
    let mut l = (permuted_block >> 32) & 0xFFFFFFFF;
    let mut r = permuted_block & 0xFFFFFFFF;

    let round_keys = generate_round_keys(key);

    for i in (0..16).rev() {
        let temp = r;
        r = l ^ f(r, round_keys[i]);
        l = temp;
    }

    let rl = (r << 32) | l;
    permute(rl, &FP, 64)
}

fn string_to_u64_blocks(input: &str) -> Vec<u64> {
    let bytes = input.as_bytes();
    let mut blocks = Vec::new();

    for chunk in bytes.chunks(8) {
        let mut block: u64 = 0;
        for (i, &byte) in chunk.iter().enumerate() {
            block |= (byte as u64) << (i * 8);
        }
        blocks.push(block);
    }

    blocks
}

fn read_input(prompt: &str) -> Result<String> {
    println!("{}", prompt);
    let mut input = String::new();
    std::io::stdin().read_line(&mut input)?;
    Ok(input.trim().to_string())
}

fn read_hex_key() -> Result<u64> {
    let hex_key: u64;
    loop {
        let key = read_input("Введите ключ - 8 байт в HEX формате")?;
        if key.len() != 16 {
            println!("Неверная длина ключа");
            continue;
        }
        match u64::from_str_radix(key.as_str(), 16) {
            Ok(num) => {
                hex_key = num;
                break;
            }
            Err(_) => {
                println!("Неправильный формат ключа");
                continue;
            }
        };
    }
    Ok(hex_key)
}

fn main() -> Result<()> {
    loop {
        match read_input("1 - Зашифровать\n2 - Расшифровать")?.as_str() {
            "1" => {
                let hex_key = read_hex_key()?;
                let mut input_file = File::open("input.txt")?;
                let mut input_text = String::new();
                input_file.read_to_string(&mut input_text)?;
                let encrypted: Vec<u64> = string_to_u64_blocks(&input_text)
                    .iter()
                    .map(|block| des_encrypt(block.clone(), hex_key))
                    .collect();
                let mut output_file = File::create("encrypted.txt")?;
                output_file.write(
                    encrypted
                        .iter()
                        .flat_map(|value| value.to_ne_bytes())
                        .collect::<Vec<u8>>()
                        .as_slice(),
                )?;
                println!("Файл успешно зашифрован!");
                break;
            }
            "2" => {
                let hex_key = read_hex_key()?;
                let mut readed_from_file = Vec::<u8>::new();
                File::open("encrypted.txt")?.read_to_end(&mut readed_from_file)?;
                let decrypted: Vec<u64> = readed_from_file
                    .chunks_exact(8)
                    .map(|chunk| u64::from_ne_bytes(chunk.try_into().unwrap()))
                    .collect::<Vec<u64>>()
                    .iter()
                    .map(|block| des_decrypt(block.clone(), hex_key))
                    .collect();
                let mut output_file_decrypted = File::create("decrypted.txt")?;
                output_file_decrypted.write(
                    decrypted
                        .iter()
                        .flat_map(|value| value.to_ne_bytes())
                        .collect::<Vec<u8>>()
                        .as_slice(),
                )?;
                println!("Файл успешно расшифрован!");
                break;
            }
            _ => {
                println!("Неизвестная опция");
                continue;
            }
        }
    }
    Ok(())
}
