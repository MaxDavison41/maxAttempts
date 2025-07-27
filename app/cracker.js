const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');

// Main function to start cracking a given password
async function startCracking(password) {
  console.log("Starting to crack:", password);
  const startTime = performance.now();
  updateStatusMessage(`🔍🥷 Attempting to crack your password... 📱🪛`);

  const result = await crackPassword(password);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  const outputFile = path.join(__dirname, 'data/cracked.txt');

  // Log result to console and file
  if (result === 0) {
    updateStatusMessage(`✅ Password: '${password}' cracked in ${elapsed} seconds! 🔑🔓`);
    try {
      fs.appendFileSync(outputFile, `Password: '${password}' cracked in ${elapsed} seconds!\n`);
    } catch (err) {
      console.error('Error:', err);
    }
  } else {
    updateStatusMessage(`❌ Password not found after ${elapsed} seconds. 😔`);
    try {
      fs.appendFileSync(outputFile, `Password: '${password}' not found after ${elapsed} seconds!\n`);
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

// Checks if the password is in the common_passwords.txt list
async function checkCommonPasswords(password) {
  const filePath = path.join(__dirname, 'data/common_passwords.txt');
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    let uppercase = line.charAt(0).toUpperCase() + line.slice(1);
    let lowercase = line.charAt(0).toLowerCase() + line.slice(1);
    if (uppercase === password || lowercase === password) return 0;
  }

  return 1;
}

// Replaces characters in a string at certain positions.
// Used for replacement like a → @
function replaceAtIndexes(word, indexes, substitute) {
  const chars = word.split('');
  for (const i of indexes) {
    chars[i] = substitute;
  }
  return chars.join('');
}

// Generates versions of a word by replacing a target character and appending characters
function generateReplacements(word, targetChar, substitute, chars) {
  const results = new Set();
  const indexes = [];

  for (let i = 0; i < word.length; i++) {
    if (word[i].toLowerCase() == targetChar.toLowerCase()) {
      indexes.push(i);
    }
  }

  if (indexes.length == 0) return Array.from(results);

  results.add(replaceAtIndexes(word, [indexes[0]], substitute));

  if (indexes.length > 1 && indexes[0] !== indexes[indexes.length - 1]) {
    results.add(replaceAtIndexes(word, [indexes[indexes.length - 1]], substitute));
  }

  if (indexes.length > 1) {
    results.add(replaceAtIndexes(word, [indexes[0], indexes[indexes.length - 1]], substitute));
  }

  const additions = new Set();
  for (const word of results) {
    for (const char of chars) {
      additions.add(word + char);
    }
  }

  for (const newWord of additions) {
    results.add(newWord);
  }

  return Array.from(results);
}

// Checks a single password guess against a real password.
// Includessome character replacements/additions.
function stringChecker(password, guess, chars) {
  let uppercase = guess.charAt(0).toUpperCase() + guess.slice(1);
  let lowercase = guess.charAt(0).toLowerCase() + guess.slice(1);
  if (lowercase == password || uppercase == password) return 0;

  // Replace 'a' with '@'
  if (guess.toLowerCase().includes('a')) {
    let replaceA = generateReplacements(lowercase, 'a', '@', chars);
    for (const replaceGuess of replaceA) {
      if (replaceGuess == password || replaceGuess.charAt(0).toUpperCase() + replaceGuess.slice(1) == password) return 0;
    }
  }

  // Replace 's' with '$'
  if (guess.toLowerCase().includes('s')) {
    let replaceS = generateReplacements(lowercase, 's', '$', chars);
    for (const replaceGuess of replaceS) {
      if (replaceGuess == password || replaceGuess.charAt(0).toUpperCase() + replaceGuess.slice(1) == password) return 0;
    }
  }

  // Append characters to the end
  for (const charOne of chars) {
    if (uppercase + charOne === password || lowercase + charOne === password) return 0;
  }

  return 1;
}

// Attempts to match the password with an array of guesses
// Each guess is tested alongside the guess with some character replacements/additions.
function basicCheck(password, toCheck, chars) {
  for (const guess of toCheck) {
    let uppercase = guess.charAt(0).toUpperCase() + guess.slice(1);
    let lowercase = guess.charAt(0).toLowerCase() + guess.slice(1);
    if (lowercase == password || uppercase == password) return 0;

    if (guess.toLowerCase().includes('a')) {
      let replaceA = generateReplacements(lowercase, 'a', '@', chars);
      for (const replaceGuess of replaceA) {
        if (replaceGuess == password || replaceGuess.charAt(0).toUpperCase() + replaceGuess.slice(1) == password) return 0;
      }
    }

    if (guess.toLowerCase().includes('s')) {
      let replaceS = generateReplacements(lowercase, 's', '$', chars);
      for (const replaceGuess of replaceS) {
        if (replaceGuess == password || replaceGuess.charAt(0).toUpperCase() + replaceGuess.slice(1) == password) return 0;
      }
    }

    if (guess.toLowerCase().includes('o')) {
      let replaceO = generateReplacements(lowercase, 'o', '0', chars);
      for (const replaceGuess of replaceO) {
        if (replaceGuess == password || replaceGuess.charAt(0).toUpperCase() + replaceGuess.slice(1) == password) return 0;
      }
    }

    // Add 1 or 2 suffix characters
    for (const charOne of chars) {
      if (uppercase + charOne === password || lowercase + charOne === password) return 0;
      for (const charTwo of chars) {
        if (uppercase + charOne + charTwo === password || lowercase + charOne + charTwo === password) return 0;
      }
    }
  }
  return 1;
}

// Reads a file and returns its contents as an array of trimmed lines
async function fileToArray(filePath) {
  const lines = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      lines.push(trimmed);
    }
  }

  return lines;
}

// Tries combinations of 2 words, and word+name or name+word against the password
function complexCheck(password, words, names, chars) {
  for (const wordOne of words) {
    for (const wordTwo of words) {
      if (stringChecker(password, wordOne + wordTwo, chars) == 0) return 0;
    }
  }

  for (const name of names) {
    for (const word of words) {
      if (stringChecker(password, word + name, chars) == 0) return 0;
      if (stringChecker(password, name + word, chars) == 0) return 0;
    }
  }

  return 1;
}

// Even more advanced combinations including prefixes and joiners (disabled for runtime)
function extremeCheck(password, words, names, chars, prefixes, joiners) {
  for (const wordOne of words) {
    for (const wordTwo of words) {
      if (stringChecker(password, wordOne + wordTwo, chars) == 0) return 0;
      for (const prefix of prefixes) {
        if (stringChecker(password, prefix + wordOne + wordTwo, chars) == 0) return 0;
      }
      for (const joiner of joiners) {
        if (stringChecker(password, wordOne + joiner + wordTwo, chars) == 0) return 0;
      }
    }
  }

  for (const name of names) {
    for (const word of words) {
      if (stringChecker(password, word + name, chars) == 0) return 0;
      if (stringChecker(password, name + word, chars) == 0) return 0;
      for (const prefix of prefixes) {
        if (stringChecker(password, prefix + name, chars) == 0) return 0;
        if (stringChecker(password, prefix + word, chars) == 0) return 0;
        if (stringChecker(password, prefix + word + name, chars) == 0) return 0;
        if (stringChecker(password, prefix + name + word, chars) == 0) return 0;
      }
      for (const joiner of joiners) {
        if (stringChecker(password, name + joiner + word, chars) == 0) return 0;
        if (stringChecker(password, word + joiner + name, chars) == 0) return 0;
      }
    }
  }
  return 1;
}

// Brute-force attempts all passwords up to length 5 using a fixed charset
function bruteForce(password, maxLen = 5) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$'
  const base = charset.length;

  for (let length = 1; length <= maxLen; length++) {
    const maxNum = Math.pow(base, length);

    for (let num = 0; num < maxNum; num++) {
      let guess = '';
      let temp = num;

      for (let i = 0; i < length; i++) {
        guess = charset[temp % base] + guess;
        temp = Math.floor(temp / base);
      }

      if (guess === password) return 0;
    }
  }
  return 1;
}

// Runs all cracking attempts in order: basic → complex → brute force
async function maxAttempts(password) {
  const extendedWordFile = path.join(__dirname, 'data/words_extended.txt');
  const wordFile = path.join(__dirname, 'data/words.txt');
  const nameFile = path.join(__dirname, 'data/names.txt');
  const extendedCharFile = path.join(__dirname, 'data/chars_extended.txt');
  const charFile = path.join(__dirname, 'data/chars.txt');

  const extendedWords = await fileToArray(extendedWordFile);
  const words = await fileToArray(wordFile);
  const names = await fileToArray(nameFile);
  const extendedChars = await fileToArray(extendedCharFile);
  const chars = await fileToArray(charFile);

  let found = basicCheck(password, extendedWords, extendedChars);
  if (found == 0) return 0;

  found = basicCheck(password, names, extendedChars);
  if (found == 0) return 0;

  found = complexCheck(password, words, names, chars);
  if (found == 0) return 0;

  // Optional: uncomment to enable extremeCheck (very slow)
  // const prefixes = await fileToArray(path.join(__dirname, 'data/prefix.txt'));
  // const joiners = await fileToArray(path.join(__dirname, 'data/joiners.txt'));
  // found = extremeCheck(password, words, names, chars, prefixes, joiners);
  // if (found == 0) return 0;

  found = bruteForce(password);
  if (found == 0) return 0;

  return 1;
}

// Attempts to crack a password using multiple strategies
async function crackPassword(password) {
  let found = await checkCommonPasswords(password).catch(console.error);
  if (found == 0) return 0;

  found = await maxAttempts(password).catch(console.error);
  if (found == 0) return 0;

  return 1;
}

// Batch test a list of password files and log crack time/results
async function test() {
  const fileDest = path.join(__dirname, `/data/cracked.txt`);

  for (let fileNum = 5; fileNum <= 8; fileNum++) {
    let filePath = path.join(__dirname, `/../analysis/data/password${fileNum}.txt`);
    let fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const startTime = performance.now();
      let found = await checkCommonPasswords(line).catch(console.error);
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

      if (found == 0) {
        fs.appendFileSync(fileDest, `Password: '${line}' cracked in ${elapsed} seconds\n`);
      } else {
        fs.appendFileSync(fileDest, `Password: '${line}' not cracked. Time taken: ${elapsed} seconds.\n`);
      }
    }
  }
}

// Quick test to measure how long a password takes to check against common list
async function timeTrial() {
  const startTime = performance.now();
  let result = await crackPassword("ImPoSsIbLe");

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`COMPLETE with ${result == 0 ? "SUCCESS" : "FAIL"} taking ${elapsed} seconds`);
}
