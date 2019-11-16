const request = require('request');
const readline = require('readline');
// base url
const apihost = "https://fourtytwowords.herokuapp.com"
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var msg;


function cli(rawArgs) {
    convertToOptions(rawArgs)
    async function convertToOptions(rawArgs) {
        var args = rawArgs.slice(2)
        switch (args[0]) {
            case 'defn':
                console.log('this is word', args[1]);
                return new Promise((resolve, reject) => {

                    request(`${apihost}/word/${args[1]}/definitions?api_key=${api_key}`, (err, response, result) => {
                        if (err) {
                            console.log(err)
                            reject(JSON.parse(err).error)
                        }
                        else {
                            console.log('\x1b[36m%s\x1b[0m', 'List of definitions');  //cyan
                            console.log('', "")
                            let parsedResult = JSON.parse(result)
                            for (let i = 0; i < parsedResult.length; i++) {
                                console.log(" - ", parsedResult[i].text)
                            }
                            return resolve()
                        }
                    })
                })

            case 'syn':
                console.log('this is word', args[1])
                request(`${apihost}/word/${args[1]}/relatedWords?api_key=${api_key}`, (err, response, result) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Synonyme ::", result)
                        let parsedResult = JSON.parse(result);
                        parsedResult.forEach(item => {
                            if (item.relationshipType == "synonym") {
                                console.log('\x1b[36m%s\x1b[0m', 'List of synonyms available' + '\n');  //cyan
                                console.log("", "")
                                item.words.forEach(word => {
                                    console.log(' - ', word)
                                });
                                return
                            }
                        })
                    }
                })
                break;
            case 'ant':
                console.log('this is word', args[1])
                await request(`${apihost}/word/${args[1]}/relatedWords?api_key=${api_key}`, (err, response, result) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Synonyme ::", result)
                        let parsedResult = JSON.parse(result);
                        parsedResult.forEach(item => {
                            if (item.relationshipType == "antonym") {
                                console.log('\x1b[36m%s\x1b[0m', 'List of antonyms available' + '\n');  //cyan
                                item.words.forEach(word => {
                                    console.log(' - ', word)
                                })
                            }
                        })
                    }
                })
                break;
            case 'ex':
                console.log('this is word', args[1])
                await request(`${apihost}/word/${args[1]}/examples?api_key=${api_key}`, (err, response, result) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        // console.log("Examples ::", result)
                        let parsedResult = JSON.parse(result);
                        console.log('\x1b[36m%s\x1b[0m', 'List of examples available' + '\n');  //cyan
                        parsedResult.examples.forEach(example => {
                            console.log(' - ', example.text + '\n')
                            // console.log('',"")
                        })
                    }
                })
                break;

            case 'play':
                msg = async function () {
                    console.log("\x1b[0m", "")
                    let wordDetails = await getRandomWord()
                    let definition = await getDefinition(wordDetails)
                    let synonym = await getSynonym(wordDetails, true)
                    let antonym = await getAntonym(wordDetails)
                    let validateAnswer = await validateUserAnswer(wordDetails)
                    // console.log('Message:', wordDetails);
                    process.kill(0)
                }
                msg()
                break;
            default:
                if (args[0]) {
                    getCompleteWordDetails(args[0])
                }
                else {
                    await request(`${apihost}/words/randomWord?api_key=${api_key}`, (err, response, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            let parsedResult = JSON.parse(result)
                            console.log("Word of the day :: " + parsedResult.word)
                            getCompleteWordDetails(parsedResult.word)
                        }
                    })
                }
                break;
        }
    }
}

let getCompleteWordDetails = async (word) => {
    // word definition
    await request(`${apihost}/word/${word}/definitions?api_key=${api_key}`, (err, response, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('\x1b[36m%s\x1b[0m', 'List of definitions');  //cyan
            console.log('', "")
            let parsedResult = JSON.parse(result)
            for (let i = 0; i < parsedResult.length; i++) {
                console.log(" - ", parsedResult[i].text)

            }
        }
    })
    // word Synonyms
    await request(`${apihost}/word/${word}/relatedWords?api_key=${api_key}`, (err, response, result) => {
        if (err) {
            console.log(err)
        }
        else {
            // console.log("Synonyme ::", result)
            let parsedResult = JSON.parse(result);
            parsedResult.forEach(item => {
                if (item.relationshipType == "synonym") {
                    console.log('\x1b[36m%s\x1b[0m', 'List of synonyms available' + '\n');  //cyan
                    console.log("", "")
                    item.words.forEach(word => {
                        console.log(' - ', word)
                    })
                }
            })
        }
    })
    // word Anonyms
    await request(`${apihost}/word/${word}/relatedWords?api_key=${api_key}`, (err, response, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Synonyme ::", result)
            let parsedResult = JSON.parse(result);
            parsedResult.forEach(item => {
                if (item.relationshipType == "antonym") {
                    console.log('\x1b[36m%s\x1b[0m', 'List of antonyms available' + '\n');  //cyan
                    item.words.forEach(word => {
                        console.log(' - ', word)
                    })
                }
            })
        }
    });
    // word examples
    await request(`${apihost}/word/${word}/examples?api_key=${api_key}`, (err, response, result) => {
        if (err) {
            console.log(err)
        }
        else {
            // console.log("Examples ::", result)
            let parsedResult = JSON.parse(result);
            console.log('\x1b[36m%s\x1b[0m', 'List of examples available' + '\n');  //cyan
            parsedResult.examples.forEach(example => {
                console.log(' - ', example.text + '\n')
                // console.log('',"")
            })
        }
    })
}

let getSynonym = async (word, log) => {
    return new Promise(resolve => {
        request(`${apihost}/word/${word}/relatedWords?api_key=${api_key}`, async (err, response, result) => {
            if (err) {
                console.log(err)
            }
            else {
                let parsedResult = JSON.parse(result);
                await parsedResult.forEach(item => {
                    if (item.relationshipType == "synonym") {
                        let randomIndex = Math.floor(Math.random() * item.words.length)
                        if (log === true) {
                            console.log('\x1b[36m%s\x1b[0m', 'Here is your Synonym > \n');  //cyan

                            console.log("Syn::" + item.words[randomIndex] + "\n")
                            resolve(parsedResult)
                        }
                        else {
                            resolve(item.words)
                        }
                    }
                })
            }
        })
    })
}
let getAntonym = async (word) => {
    return new Promise(resolve => {
        request(`${apihost}/word/${word}/relatedWords?api_key=${api_key}`, async (err, response, result) => {
            if (err) {
                console.log(err)
            }
            else {
                let parsedResult = JSON.parse(result);
                await parsedResult.forEach(item => {
                    if (item.relationshipType == "antonym") {
                        console.log('\x1b[36m%s\x1b[0m', 'Here is your Antonym > \n');  //cyan
                        let randomIndex = Math.floor(Math.random() * item.words.length)
                        console.log("Syn::" + item.words[randomIndex] + "\n")
                        resolve()
                    }
                    else {
                        resolve()
                    }
                })
            }
        })
    })
}
let getRandomWord = () => {
    return new Promise(resolve => {

        request(`${apihost}/words/randomWord?api_key=${api_key}`, async (err, response, result) => {
            if (err) {
                console.log(err)
            }
            else {
                let parsedResult = JSON.parse(result)
                console.log("Word of the day :: " + parsedResult.word)
                resolve(parsedResult.word)
            }
        })
    })
}

let getDefinition = (word) => {
    return new Promise(resolve => {

        request(`${apihost}/word/${word}/definitions?api_key=${api_key}`, (err, response, result) => {
            if (err) {
                console.log(err)
                reject(JSON.parse(err).error)
            }
            else if (!JSON.parse(err)) {
                console.log('\x1b[36m%s\x1b[0m', 'Here is your definition > \n');  //cyan
                let parsedResult = JSON.parse(result)
                let randomIndex = Math.floor(Math.random() * parsedResult.length)
                console.log("Def ::", parsedResult[randomIndex].text + '\n')
                resolve()
            }
        })
    })
}

let checkForAnswer = (word, answer) => {
    return new Promise(async (resolve) => {
        if (answer == word) {
            console.log("\x1b[32m", "Brilliant!, " + answer + " is a correct answer")
            rl.question("Do you want to try again(Y/N)?\n", (playAgain) => {
                if (playAgain == "y") {
                    msg()
                } else if (playAgain == "n") {
                    resolve()
                }
            })
        }
        else {
            let synonymArray = await getSynonym(word, false);
            // console.log(synonym)
            if (synonymArray.includes(answer)) {
                console.log("\x1b[32m", "Brilliant!, " + answer + " is a correct answer")
                rl.question("Do you want to try again(Y/N)?\n", (playAgain) => {
                    if (playAgain == "y") {
                        msg()
                    } else if (playAgain == "n") {
                        resolve(true)
                    }
                })
            }
            else {
                resolve(false)
            }
        }
    })
}

let getHint = async (word) => {
    return new Promise(async (resolve) => {
        String.prototype.shuffle = function () {
            var a = this.split(""),
                n = a.length;

            for (var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        }

        let hintsArray = [word.shuffle(), await getDefinition(word), await getSynonym(word, false), await getAntonym(word)]

        // hintsArray.push(word.shuffle(), await getDefinition(word), await getSynonym(word, false), await getAntonym(word))
        resolve(hintsArray)
        // console.log("Hints Array ::", hintsArray)

    })
}

let validateUserAnswer = (word) => {
    return new Promise(resolve => {
        rl.question("Guess the word by looking at the definiton and synonym. \n>>", async (answer) => {
            if (answer == word) {
                console.log("\x1b[32m", "Brilliant!, " + answer + " is a correct answer")
                rl.question("Do you want to try again(Y/N)?\n", (playAgain) => {
                    if (playAgain == "y") {
                        msg()
                    } else if (playAgain == "n") {
                        resolve()
                    }
                })
            }
            else {
                let synonymCheck = await checkForAnswer(word, answer)
                console.log("Synonym check ::", synonymCheck)
                if (synonymCheck) {
                    process.kill(0)
                }
                else if (!synonymCheck) {
                    console.log("Oops!, incorrect answer. Please select one. \n")
                    rl.question("1.Try again\n2.Hint\n3.Quit\n >>(Default is 3):", async (userChoice) => {
                        if (userChoice == 1) {
                            validateUserAnswer(word)
                        }
                        else if (userChoice == 2) {
                            let hints = await getHint(word)
                            // let randomIndex = Math.floor(Math.random() * hints.length)
                            // console.log('\x1b[36m%s\x1b[0m', 'Here is a hint for you, try again > \n');  //cyan
                            // console.log(await hints[randomIndex]);
                            validateUserAnswer(word)
                        }
                        else if (userChoice == 3) {
                            process.kill(0)
                        }
                    })
                }
            }
        })
    })
}

module.exports = {
    cli
}