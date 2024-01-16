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

