const NUM_FILES = 4;
main();

function getContents(filename) {
    const fs = require('node:fs');
    const dir = __dirname;
    try {
        const data = fs.readFileSync(`${dir}/data/password${filename}.txt`, 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        return '';
    }
}

function isAlpha(character) {
    return /^[A-Z]$/i.test(character);
}

function isNumber(character) {
    return /^[0-9]$/i.test(character);
}

function formatCharData(data, filename, totalData) {
    const header = `====================================${filename}====================================\n`;
    let formattedData = header;
    let charCounts = {};

    for (let index = 0; index < data.length; index++) {
        let element = data[index];

        if (element == '\n') continue;
        if (isAlpha(element)) continue;

        if (isNumber(element)) {
            let count = index + 1;
            while (count < data.length && isNumber(data[count])) {
                element += data[count];
                count++;
            }
            index = count - 1;
        }

        charCounts[element] = (charCounts[element] || 0) + 1;
        totalData[element] = (totalData[element] || 0) + 1;
    }

    const sorted = Object.entries(charCounts).sort((a, b) => b[1] - a[1]);

    for (let [character, count] of sorted) {
        formattedData += `character: '${character}' with count: ${count}\n`;
    }

    return [formattedData, totalData];
}

function formatCharWordData(data, filename, totalData) {
    const header = `====================================${filename}====================================\n`;
    let formattedData = header;
    let capCount = {};

    let startPos = 0;
    let endPos = 0;
    for (let index = 0; index < data.length; index++) {
        let element = data[index];
        if (element == '\n') {
            endPos = index - 1
            for (index = startPos; index <= endPos; index++) {
                let position = locationCalc(startPos, endPos, index);
                let element = data[index];

                if (!isAlpha(element) && !isNumber(element) && element != '\n' & element != ' ') {
                    capCount[position] = (capCount[position] || 0) + 1;
                    totalData[position] = (totalData[position] || 0) + 1;
                }
                capCount[position] = (capCount[position] || 0);
                totalData[position] = (totalData[position] || 0);
            }
            index = endPos + 2;
            startPos = endPos + 2;
        } 
        
        
    }

    for (let location in capCount) {
        formattedData += `Location: '${location}' with count: ${capCount[location]}\n`;
    }

    return [formattedData, totalData];

}

function formatCapData(data, filename, totalData) {
    const header = `====================================${filename}====================================\n`;
    let formattedData = header;
    let capCount = {};
    let position = 1;
    for (let index = 0; index < data.length; index++) {
        let element = data[index];
        if (element == '\n') position = 0;
        if (isAlpha(element) && element == element.toUpperCase()) {
            capCount[position] = (capCount[position] || 0) + 1;
            totalData[position] = (totalData[position] || 0) + 1;
        }

        capCount[position] = (capCount[position] || 0);
        totalData[position] = (totalData[position] || 0);
        position++
    }

    for (let location in capCount) {
        if (location == '0') continue;
        formattedData += `Location: '${location}' with count: ${capCount[location]}\n`;
    }

    return [formattedData, totalData];
}

function suffixFormatter(number) {
    if (number % 10 == 1) return `${number}st`;
    if (number % 10 == 2) return `${number}nd`;
    if (number % 10 == 3) return `${number}rd`;
    return `${number}th`;
}

function locationCalc(startPos, endPos, currPos) {
    const wordLength = endPos - startPos + 1;
    if (currPos == startPos) return "1st Letter";
    if (currPos == endPos) return "Last Letter";

    for (let i = 1; i < wordLength; i++) {
        if (wordLength <= 1 + (i * 2)) return "Middle Letter";
        if (currPos == startPos + i) return `${suffixFormatter(i + 1)} Letter`
        if (currPos == endPos - i) return `${suffixFormatter(i + 1)}-to-Last Letter`
    }
}

function formatCapWordData(data, filename, totalData) {
    const header = `====================================${filename}====================================\n`;
    let formattedData = header;
    let capCount = {};

    let startPos = 0;
    let endPos = 0;
    for (let index = 0; index < data.length; index++) {
        let element = data[index];
        if (isAlpha(element)) {
            startPos = index;
            while (isAlpha(element)) {
                index++;
                element = data[index];
            }
            endPos = index - 1;
        } else {
            continue;
        }
        for (index = startPos; index <= endPos; index++) {
            let position = locationCalc(startPos, endPos, index);
            let element = data[index];
            if (isAlpha(element) && element == element.toUpperCase()) {
                capCount[position] = (capCount[position] || 0) + 1;
                totalData[position] = (totalData[position] || 0) + 1;
            }
            capCount[position] = (capCount[position] || 0);
            totalData[position] = (totalData[position] || 0);
        }

    }

    for (let location in capCount) {
        if (location == '0') continue;
        formattedData += `Location: '${location}' with count: ${capCount[location]}\n`;
    }

    return [formattedData, totalData];
}

function extractCharStats() {
    let totalData = '========================== Analysis of Different Characters Used in Passwords ==========================\n\n';
    let formattedData = '';
    let individualData = {};
    for (let fileNum = 1; fileNum <= NUM_FILES; fileNum++) {
        let data = getContents(fileNum);
        [formattedData, individualData] = formatCharData(data, `password${fileNum}`, individualData)
        totalData += formattedData;
    }

    const sorted = Object.entries(individualData).sort((a, b) => b[1] - a[1]);

    totalData += `====================================Total====================================\n`;
    for (let [character, count] of sorted) {
        totalData += `character: '${character}' with count: ${count}\n`;
    }
    return totalData;
}

function extractCharWordStats() {
    let totalData = '========================== Analysis of Speical Character Positions in Words in Passwords ==========================\n\n';
    let formattedData = '';
    let individualData = {};
    for (let fileNum = 1; fileNum <= NUM_FILES; fileNum++) {
        let data = getContents(fileNum);
        [formattedData, individualData] = formatCharWordData(data, `password${fileNum}`, individualData)
        totalData += formattedData;
    }

    totalData += `====================================Total====================================\n`;
    for (let location in individualData) {
        if (location == '0') continue;
        totalData += `Position in Word: '${location}' with count: ${individualData[location]}\n`;
    }
    return totalData;
}


function extractCapStats() {
    let totalData = '========================== Analysis of Capital Letter Positions in Passwords ==========================\n\n';
    let formattedData = '';
    let individualData = {};
    for (let fileNum = 1; fileNum <= NUM_FILES; fileNum++) {
        let data = getContents(fileNum);
        [formattedData, individualData] = formatCapData(data, `password${fileNum}`, individualData)
        totalData += formattedData;
    }

    totalData += `====================================Total====================================\n`;
    for (let location in individualData) {
        if (location == '0') continue;
        totalData += `Location: '${location}' with count: ${individualData[location]}\n`;
    }
    return totalData;
}

function extractCapWordStats() {
    let totalData = '========================== Analysis of Capital Letter Positions in Words in Passwords ==========================\n\n';
    let formattedData = '';
    let individualData = {};
    for (let fileNum = 1; fileNum <= NUM_FILES; fileNum++) {
        let data = getContents(fileNum);
        [formattedData, individualData] = formatCapWordData(data, `password${fileNum}`, individualData)
        totalData += formattedData;
    }

    totalData += `====================================Total====================================\n`;
    for (let location in individualData) {
        if (location == '0') continue;
        totalData += `Position in Word: '${location}' with count: ${individualData[location]}\n`;
    }
    return totalData;
}

function writeCharStats(content) {
    const fs = require('node:fs');
    fs.writeFile('character_analysis.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}

function writeCharWordStats(content) {
    const fs = require('node:fs');
    fs.writeFile('character_in_words_analysis.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}

function writeCapStats(content) {
    const fs = require('node:fs');
    fs.writeFile('capitals_analysis.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}

function writeCapWordStats(content) {
    const fs = require('node:fs');
    fs.writeFile('capitals_in_words_analysis.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}

function main() {
    console.log('Beginning Analysis');

    let content = extractCharStats();
    writeCharStats(content);

    content = extractCharWordStats();
    writeCharWordStats(content)

    content = extractCapStats();
    writeCapStats(content);

    content = extractCapWordStats();
    writeCapWordStats(content);

    console.log('Ending Analysis');
}
