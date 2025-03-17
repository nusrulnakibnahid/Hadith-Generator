const hadithTextElement = document.querySelector("#hadith-text");
const bookElement = document.querySelector("#book");
const banglaElement = document.querySelector("#bangla-translation");
const generateButtonElement = document.querySelector("#generateBtn");
const shareButtonElement = document.querySelector("#shareBtn");
const hadithBookElement = document.querySelector("#hadithBook");
const hadithNumberInput = document.querySelector("#hadithNumberInput");
const searchBtn = document.querySelector("#searchBtn");
const langToggle = document.querySelector("#langToggle");
const themeToggle = document.querySelector("#themeToggle");
const langIcon = document.querySelector("#langIcon");
const themeIcon = document.querySelector("#themeIcon");
const appTitle = document.querySelector("#appTitle");

let isEnglish = localStorage.getItem('lang') !== 'bn';
let isDarkMode = localStorage.getItem('theme') === 'dark';

// Initialize theme and language
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    updateLanguage();
});

const bookMapping = {
    bukhari: { en: "Bukhari", bn: "বুখারী" },
    muslim: { en: "Muslim", bn: "মুসলিম" },
    abudawud: { en: "Abu Dawud", bn: "আবু দাউদ" },
    ibnmajah: { en: "Ibn Majah", bn: "ইবনে মাজাহ" },
    tirmidhi: { en: "Tirmidhi", bn: "তিরমিযী" }
};

// Theme handling
const applyTheme = () => {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
};

// Update book names
const updateBookNames = () => {
    const options = hadithBookElement.options;
    for (let i = 0; i < options.length; i++) {
        const bookValue = options[i].value;
        options[i].textContent = isEnglish ? 
            bookMapping[bookValue].en : 
            bookMapping[bookValue].bn;
    }
};

// Update language
const updateLanguage = () => {
    if (isEnglish) {
        appTitle.textContent = "Sunnah Sparks";
        hadithNumberInput.placeholder = "Enter Hadith Number";
        generateButtonElement.textContent = "Generate Random Hadith";
        shareButtonElement.textContent = "Share on Social Media";
        document.body.classList.remove('bangla-ui');
        localStorage.setItem('lang', 'en');
    } else {
        appTitle.textContent = "সুন্নাহ স্পার্কস";
        hadithNumberInput.placeholder = "হাদিস নম্বর লিখুন";
        generateButtonElement.textContent = "যেকোনো একটি হাদিস দিন";
        shareButtonElement.textContent = "সোশ্যাল মিডিয়ায় শেয়ার করুন";
        document.body.classList.add('bangla-ui');
        localStorage.setItem('lang', 'bn');
    }
    updateBookNames();
};

// Fetch Hadith
const fetchHadith = async (book, hadithNumber = "") => {
    const selectedBook = book || hadithBookElement.value;
    try {
        const url = hadithNumber ? 
            `https://random-hadith-generator.vercel.app/${selectedBook}/${hadithNumber}` :
            `https://random-hadith-generator.vercel.app/${selectedBook}`;
        const response = await fetch(url);
        const { data } = await response.json();
        updateHadithData(data);
        translateToBangla(data.hadith_english);
    } catch (error) {
        console.error("Error fetching Hadith:", error);
        hadithTextElement.textContent = isEnglish ? 
            "Failed to fetch Hadith. Please try again." : 
            "হাদিস লোড করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন।";
    }
};

// Update Hadith display
const updateHadithData = ({ hadith_english, refno }) => {
    hadithTextElement.textContent = hadith_english;
    bookElement.textContent = `- ${refno}`;
};

// Translate to Bangla
const translateToBangla = async (text) => {
    try {
        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "bn",
            }),
        });
        const data = await response.json();

        // Check if translation is available
        if (data.translatedText) {
            banglaElement.textContent = `বাংলা অনুবাদ: ${data.translatedText}`;
        } else {
            
            banglaElement.textContent = "বাংলা অনুবাদ: শীঘ্রই উপলব্ধ করা হবে.....";
        }
    } catch (error) {
        console.error("Error translating Hadith:", error);
        
        banglaElement.textContent = "বাংলা অনুবাদ: শীঘ্রই উপলব্ধ করা হবে.....";
    }
};

// Event Listeners
generateButtonElement.addEventListener("click", () => fetchHadith());

searchBtn.addEventListener("click", () => {
    const hadithNumber = hadithNumberInput.value.trim();
    if (hadithNumber) {
        fetchHadith(null, hadithNumber);
    }
});

shareButtonElement.addEventListener("click", () => {
    const quoteText = hadithTextElement.textContent;
    const sourceText = bookElement.textContent;
    const shareText = `${quoteText} ${sourceText}`;

    if (navigator.share) {
        navigator.share({
            title: "Sunnah Sparks - Random Hadith",
            text: shareText,
            url: window.location.href,
        });
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, "_blank");
    }
});

langToggle.addEventListener("click", () => {
    isEnglish = !isEnglish;
    langIcon.textContent = isEnglish ? "🌐" : "বাং";
    updateLanguage();
});

themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    applyTheme();
});