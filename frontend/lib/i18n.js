export const T = {
  en: {
    nav: { home: "Home", about: "About", skills: "Skills", experience: "Experience", projects: "Projects", contact: "Contact" },
    available: "Available for QA roles", chip1: "Bug hunter", chip2: "API testing",
    cta1: "See what I’ve tested", cta2: "View resume",
    aboutEy: "About me", about: "Curious first.|Tester by choice.", role: "Current role", edu: "Education", train: "Training",
    skillsEy: "My toolkit", skills: "Tools for|careful breaking.",
    expEy: "Experience", exp: "Where I’ve|worked.", now: "Current", resp: "Key responsibilities",
    projEy: "Selected work", proj: "Systems I’ve|put to the test.", eduEy: "Learning", eduT: "Education|and training.",
    contactEy: "Contact", contact: "Got a build?|Send it over.", contactSub: "Open to full-time QA roles. Send a message and I’ll reply.",
    f: { name: "Name", email: "Email", subject: "Subject", message: "Message", send: "Send message", sending: "Sending…", sent: "Message sent. Thank you!", error: "Could not send. Please try again." },
    light: "Light", dark: "Dark", langBtn: "नेपाली", rights: "All rights reserved.",
  },
  ne: {
    nav: { home: "गृहपृष्ठ", about: "परिचय", skills: "सीप", experience: "अनुभव", projects: "परियोजना", contact: "सम्पर्क" },
    available: "QA अवसरका लागि उपलब्ध", chip1: "बग खोजकर्ता", chip2: "API परीक्षण",
    cta1: "मैले परीक्षण गरेका काम", cta2: "रिजुमे हेर्नुहोस्",
    aboutEy: "मेरो बारेमा", about: "जिज्ञासु स्वभाव|परीक्षक रोजाइले।", role: "हालको भूमिका", edu: "शिक्षा", train: "तालिम",
    skillsEy: "मेरा औजार", skills: "सीप र|औजार।",
    expEy: "अनुभव", exp: "कार्य|अनुभव।", now: "हालको", resp: "मुख्य जिम्मेवारी",
    projEy: "छानिएका काम", proj: "परीक्षण गरेका|प्रणालीहरू।", eduEy: "सिकाइ", eduT: "शिक्षा र|तालिम।",
    contactEy: "सम्पर्क", contact: "बिल्ड छ?|पठाउनुहोस्।", contactSub: "म पूर्णकालीन QA भूमिकाका लागि उपलब्ध छु। सन्देश पठाउनुहोस्, म जवाफ दिनेछु।",
    f: { name: "नाम", email: "इमेल", subject: "विषय", message: "सन्देश", send: "सन्देश पठाउनुहोस्", sending: "पठाउँदै…", sent: "सन्देश पठाइयो। धन्यवाद!", error: "पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।" },
    light: "उज्यालो", dark: "अँध्यारो", langBtn: "English", rights: "सर्वाधिकार सुरक्षित।",
  },
};

// Replaces built-in texts with the ones saved in the dashboard (Site text page).
export function applyTexts(base, texts, lang) {
  const out = JSON.parse(JSON.stringify(base));
  Object.entries(texts || {}).forEach(([key, v]) => {
    const val = lang === "ne" ? v.ne : v.en;
    if (!val) return;
    const path = key.split(".");
    let o = out;
    for (let i = 0; i < path.length - 1; i++) { o = o[path[i]]; if (!o) return; }
    o[path[path.length - 1]] = val;
  });
  return out;
}

export function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => (typeof v === "object" ? flatten(v, prefix + k + ".") : [[prefix + k, v]]));
}
