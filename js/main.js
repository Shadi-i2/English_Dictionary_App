const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    searchButton = wrapper.querySelector("button"),
    wordSpan = wrapper.querySelector(".word span"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    infoText = wrapper.querySelector(".info-text"),
    volumeIcon = wrapper.querySelector(".word i"),
    removeIcon = wrapper.querySelector(".search .close")
let audioSpeech, audioSrc;

function setData(setdata) {
    let arr = [];
    for (let i = 0; i < setdata.length; i++) {
        for (let j in setdata[i]) {
            if (j == "example") {
                arr.push(i);
                document.querySelector(".example span").innerText = setdata[arr[0]].example;
            };
        };
    };
};

function getDataApi(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span> "${word}" </span>.Please, try to search for another word`;
    } else {
        wrapper.classList.add("active");
        let meanings = result["0"].meanings;
        document.querySelector(".word p").innerText = result["0"].word;
        document.querySelector(".meaning span").innerText = meanings[0].definitions[0].definition;

        let setdata, wordType, setSynonyms;
        meanings.forEach((meaning) => {
            if (meaning.partOfSpeech == "adjective") {
                setdata = meaning.definitions;
                wordType = meaning.partOfSpeech;
                setSynonyms = meaning.synonyms;
                setData(setdata);
            };
        });

        if (setdata == null) {
            setdata = meanings[0].definitions;
            wordType = meanings[0].partOfSpeech;
            setSynonyms = meanings["0"].synonyms;
            setData(setdata);
        };

        if (result[0].phonetics.length > 0) {
            volumeIcon.style.display = "block";
            audioSrc = "";
            result[0].phonetics.forEach(ele => {
                ele.audio != "" ? audioSrc = ele.audio : "";
                ele.text != "" ? wordSpan.innerHTML = `${wordType} ${ele.text}` : `${wordType}`;
            })
            audioSpeech = new Audio(audioSrc);
        } else {
            wordSpan.innerHTML = "";
            volumeIcon.style.display = "none";
        };

        if (setSynonyms.length > 0) {
            synonyms.innerHTML = "";
            setSynonyms.forEach(synonym => {
                let span = document.createElement("span");
                span.innerText = `${synonym}, `;
                synonyms.appendChild(span);
                span.addEventListener("click", () => {
                    searchInput.value = span.innerHTML.trim().split(",")[0];
                    searchButton.click();
                });
            });
        } else synonyms.innerHTML = '"Not Found!"';

        console.log(result);
    };
};

function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then((res) => res.json())
        .then((result) => getDataApi(result, word));
};

searchButton.addEventListener("click", () => (searchInput.value !== "") ? fetchApi(searchInput.value.trim()) : "");
volumeIcon.addEventListener("click", () => audioSpeech.play());
removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = `Type any existing word and press search icon to get meaning, antonyms, synonyms, etc.`;
})