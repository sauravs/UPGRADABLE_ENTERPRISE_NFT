use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    let file_path = "/path/to/your/text_file.txt"; 
    let mut count = 0;

    if let Ok(file) = File::open(file_path) {
        let reader = BufReader::new(file);

        for line in reader.lines() {
            if let Ok(line) = line {
                let words: Vec<&str> = line.split_whitespace().collect();

                for word in words {
                    if word.contains("public") {
                        println!("{}", word);
                        count += 1;
                    }
                }
            }
        }

        println!("The word 'public' appears {} times", count);
    } else {
        println!("Failed to open the file");
    }

    
}

// Write function to add two numbers

fn add(a: i32, b: i32) -> i32 {
    a + b                                        
}

// Write function to reverse a string

fn reverse_string(s: &str) -> String {
    s.chars().rev().collect::<String>()
}

// Write function to check if the given year is a leap year or not

fn is_leap_year(year: i32) -> bool {
    if year % 4 == 0 {
        if year % 100 == 0 {
            if year % 400 == 0 {
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
}         






