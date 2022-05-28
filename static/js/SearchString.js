//Load a book from disk
function loadBook(filename, displayname) {
    let currentBook = "";
    let url = "./static/books/" + filename;

    //resetting UI
    document.getElementById("fileName").innerHTML = displayname;
    document.getElementById("searchstats").innerHTML = "";
    document.getElementById("keyword").value = "";

    //creating server for loading book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocsStats(currentBook);

            //removing line breaks and carriage returns and replace with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            document.getElementById('fileContent').scrollTop = 0;
        }
    }
}


//get stats of the book
function getDocsStats(fileContent) {
    var docLength = document.getElementById('docLength');
    var wordCount = document.getElementById('wordCount');
    var charCount = document.getElementById('charCount');

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g); // \S+ : for non-space continuous words
    let wordDict = {};

    //count every word in wordArray
    for (let word in wordArray) {
        let wordValue = wordArray[word];
        if (wordDict[wordValue] > 0)
            wordDict[wordValue] += 1;
        else
            wordDict[wordValue] = 1;
    }

    let commonWords = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any",
        "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either",
        "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however",
        "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my",
        "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says",
        "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis",
        "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will",
        "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't",
        "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't",
        "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd",
        "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's",
        "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd",
        "you'll", "you're", "you've"];

    //deleting common words from object
    commonWords.forEach(key => delete wordDict[key]);

    //sort
    let wordList = sortProperties(wordDict);

    var top5words = wordList.slice(0, 5);
    var least5words = wordList.slice(-5, wordList.length);

    ULTemplate(top5words, document.getElementById("mostUsed"));
    ULTemplate(least5words, document.getElementById("leastUsed"));

    //Docs stats
    charCount.innerHTML = "Character count : " + text.length;
    wordCount.innerHTML = "Word Count : " + wordArray.length;
}

function sortProperties(obj) {
    //convert obj to array
    // let arr = Object.defineProperties(obj);
    let arr = Object.entries(obj);

    //Sort the array
    arr.sort(function (first, second) {
        return second[1] - first[1];
    });

    return arr;
}

function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultHTML = "";

    for (i = 0; i < items.length; ++i)
        resultHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + "time(s)");

    element.innerHTML = resultHTML;
}

function markText() {

    // finding and undoing all the previously marked items
    marked = document.querySelectorAll('mark');
    for (let i = 0; i < marked.length; ++i)
        marked[i].outerHTML = marked[i].innerHTML;

    //making re for keyword
    var keyword = document.getElementById('keyword').value;
    var re = new RegExp(keyword, "gi");

    //clear the input field
    document.getElementById("keyword").value = "";

    //get the old unmarked content
    var display = document.getElementById('fileContent');
    var oldText = display.innerHTML;

    //marked text to replace with
    var replaceText = "<mark id='markme'>$&</mark>";

    //marking in the old content
    var newMarkedContent = oldText.replace(re, replaceText);

    //display the new content
    display.innerHTML = newMarkedContent;

    let count = document.querySelectorAll('mark').length;
    document.getElementById('searchstats').innerHTML = keyword +" : found " + count + " matches";

    //to scroll to 
    if(count>0){
        var element=document.getElementById('markme');
        element.scrollIntoView();
    }

}