// Content for Saath: UI text, step data and spoken keywords in English, Hindi and Bengali.
// Guidance is general sample content for a prototype. Confirm real requirements with the office.

const LANGS = {
  en: { voice: "en-IN" },
  hi: { voice: "hi-IN" },
  bn: { voice: "bn-IN" },
};

// Words that choose a language when the user says them.
const LANG_WORDS = {
  en: ["english", "angrezi"],
  hi: ["hindi", "हिंदी", "हिन्दी"],
  bn: ["bangla", "bengali", "bangali", "বাংলা"],
};

// Answers and commands. Matching is whole-word, so mixed-language speech works.
const WORDS = {
  yes: ["yes", "yeah", "yep", "haan", "han", "ha", "ji", "हाँ", "हां", "जी", "হ্যাঁ", "হ্যা", "হাঁ", "জি"],
  no: ["no", "nahi", "nahin", "na", "nai", "नहीं", "नही", "না", "নেই", "নাই"],
  next: ["next", "done", "continue", "aage", "agla", "ho gaya", "हो गया", "आगे", "अगला", "পরবর্তী", "হয়ে গেছে", "হয়েছে", "এগিয়ে"],
  repeat: ["repeat", "again", "dobara", "phir se", "दोबारा", "फिर से", "আবার"],
  back: ["back", "previous", "peeche", "पीछे", "আগের", "পিছনে"],
  slow: ["slow", "slower", "dheere", "धीरे", "আস্তে"],
};

const TEXT = {
  en: {
    greet: "I'm sorry for your loss. I'll help with the paperwork, one step at a time.",
    ask: {
      bank: "Did they have a bank account? Say yes or no.",
      insurance: "Did they have life insurance? Say yes or no.",
      pension: "Were they getting a pension? Say yes or no.",
    },
    plan: (n) => `I will take you through ${n} steps.`,
    chooseLang: "Which language? English, Hindi, or Bangla?",
    retryLang: "Sorry, I didn't catch that. Please say English, Hindi, or Bangla.",
    retry: "Sorry, I didn't catch that. Please say yes or no.",
    retryCmd: "Sorry, I didn't catch that. Say next, repeat, or back.",
    still: "I'm still here. Take your time.",
    noisy: "It seems noisy. Please hold the phone closer.",
    micIssue: "The microphone is not available. Please use the buttons.",
    step: "Step",
    done: "All steps are finished. You have done well.",
    hint: "You can say: next, repeat, back, slower.",
    yes: "Yes", no: "No", next: "Next", repeat: "Repeat", back: "Back",
    slow: "Speak slower", heard: "Heard:", restart: "Start again",
    disclaimer: "General guidance only. Please confirm requirements with the office.",
  },
  hi: {
    greet: "आपके नुकसान के लिए मुझे खेद है। मैं एक-एक कदम में कागज़ी काम में आपकी मदद करूँगा।",
    ask: {
      bank: "क्या उनका बैंक खाता था? हाँ या नहीं बोलिए।",
      insurance: "क्या उनका जीवन बीमा था? हाँ या नहीं बोलिए।",
      pension: "क्या उन्हें पेंशन मिलती थी? हाँ या नहीं बोलिए।",
    },
    plan: (n) => `मैं आपको ${n} कदम बताऊँगा।`,
    retry: "माफ़ कीजिए, समझ नहीं आया। कृपया हाँ या नहीं बोलिए।",
    retryCmd: "माफ़ कीजिए, समझ नहीं आया। अगला, दोबारा या पीछे बोलिए।",
    still: "मैं यहीं हूँ। आराम से बोलिए।",
    noisy: "आसपास शोर लग रहा है। कृपया फ़ोन मुँह के पास रखें।",
    micIssue: "माइक उपलब्ध नहीं है। कृपया बटन दबाइए।",
    step: "कदम",
    done: "सभी कदम पूरे हो गए। आपने बहुत अच्छा किया।",
    hint: "आप बोल सकते हैं: अगला, दोबारा, पीछे, धीरे।",
    yes: "हाँ", no: "नहीं", next: "अगला", repeat: "दोबारा", back: "पीछे",
    slow: "धीरे बोलें", heard: "सुना:", restart: "फिर से शुरू करें",
    disclaimer: "यह सामान्य जानकारी है। कृपया दफ़्तर से पुष्टि करें।",
  },
  bn: {
    greet: "আপনার ক্ষতির জন্য আমি দুঃখিত। আমি এক এক ধাপে কাগজপত্রের কাজে সাহায্য করব।",
    ask: {
      bank: "ওনার কি ব্যাংক অ্যাকাউন্ট ছিল? হ্যাঁ বা না বলুন।",
      insurance: "ওনার কি জীবন বিমা ছিল? হ্যাঁ বা না বলুন।",
      pension: "উনি কি পেনশন পেতেন? হ্যাঁ বা না বলুন।",
    },
    plan: (n) => `আমি আপনাকে ${n}টি ধাপ জানাব।`,
    retry: "দুঃখিত, বুঝতে পারিনি। অনুগ্রহ করে হ্যাঁ বা না বলুন।",
    retryCmd: "দুঃখিত, বুঝতে পারিনি। পরবর্তী, আবার বা পিছনে বলুন।",
    still: "আমি এখানেই আছি। ধীরে বলুন।",
    noisy: "মনে হচ্ছে আশেপাশে শব্দ বেশি। ফোনটা মুখের কাছে ধরুন।",
    micIssue: "মাইক্রোফোন পাওয়া যাচ্ছে না। অনুগ্রহ করে বোতাম চাপুন।",
    step: "ধাপ",
    done: "সব ধাপ শেষ। আপনি খুব ভালো করেছেন।",
    hint: "আপনি বলতে পারেন: পরবর্তী, আবার, পিছনে, আস্তে।",
    yes: "হ্যাঁ", no: "না", next: "পরবর্তী", repeat: "আবার", back: "পিছনে",
    slow: "আস্তে বলুন", heard: "শুনলাম:", restart: "আবার শুরু করুন",
    disclaimer: "এটি সাধারণ তথ্য। অনুগ্রহ করে অফিসে নিশ্চিত করুন।",
  },
};

const STEPS = {
  cert: {
    title: { en: "Get the death certificate", hi: "मृत्यु प्रमाणपत्र लें", bn: "মৃত্যু সনদ নিন" },
    text: {
      en: "Apply at the local municipal office or gram panchayat. Carry the hospital or doctor's certificate, the person's ID, and your own ID.",
      hi: "स्थानीय नगर निगम या ग्राम पंचायत में आवेदन करें। अस्पताल या डॉक्टर का प्रमाणपत्र, मृतक का पहचान पत्र और अपना पहचान पत्र साथ ले जाएँ।",
      bn: "স্থানীয় পুরসভা বা গ্রাম পঞ্চায়েতে আবেদন করুন। হাসপাতাল বা ডাক্তারের শংসাপত্র, মৃত ব্যক্তির পরিচয়পত্র এবং আপনার নিজের পরিচয়পত্র সঙ্গে নিন।",
    },
  },
  bank: {
    title: { en: "Inform the bank", hi: "बैंक को सूचित करें", bn: "ব্যাংককে জানান" },
    text: {
      en: "Visit the branch where the account is held. Carry the death certificate, the passbook, and your ID and relationship proof.",
      hi: "जिस शाखा में खाता है वहाँ जाएँ। मृत्यु प्रमाणपत्र, पासबुक, अपना पहचान पत्र और रिश्ते का प्रमाण ले जाएँ।",
      bn: "যে শাখায় অ্যাকাউন্ট আছে সেখানে যান। মৃত্যু সনদ, পাসবই, আপনার পরিচয়পত্র এবং সম্পর্কের প্রমাণ নিয়ে যান।",
    },
  },
  insurance: {
    title: { en: "Claim the life insurance", hi: "जीवन बीमा का दावा करें", bn: "জীবন বিমার দাবি জানান" },
    text: {
      en: "Contact the insurer or its nearest office. Carry the policy papers, the death certificate, and your ID.",
      hi: "बीमा कंपनी या उसके नज़दीकी दफ़्तर से संपर्क करें। पॉलिसी के कागज़, मृत्यु प्रमाणपत्र और अपना पहचान पत्र ले जाएँ।",
      bn: "বিমা কোম্পানি বা তার কাছের অফিসে যোগাযোগ করুন। পলিসির কাগজ, মৃত্যু সনদ এবং আপনার পরিচয়পত্র নিয়ে যান।",
    },
  },
  pension: {
    title: { en: "Report the pension", hi: "पेंशन की सूचना दें", bn: "পেনশনের খবর জানান" },
    text: {
      en: "Tell the office or bank that pays the pension. Carry the death certificate, the pension payment order, and your ID. Ask about a family pension.",
      hi: "जो दफ़्तर या बैंक पेंशन देता है उसे बताएँ। मृत्यु प्रमाणपत्र, पेंशन भुगतान आदेश और अपना पहचान पत्र ले जाएँ। परिवार पेंशन के बारे में पूछें।",
      bn: "যে অফিস বা ব্যাংক পেনশন দেয় তাদের জানান। মৃত্যু সনদ, পেনশন পেমেন্ট অর্ডার এবং আপনার পরিচয়পত্র নিয়ে যান। পারিবারিক পেনশনের কথা জিজ্ঞাসা করুন।",
    },
  },
};
