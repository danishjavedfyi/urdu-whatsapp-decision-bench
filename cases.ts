/**
 * The test set for "which of my answers is this customer asking for?"
 *
 * A small business writes a handful of answers once. A customer writes in
 * whatever comes naturally, which in Pakistan is rarely plain English: it is
 * Urdu in Latin letters with no agreed spelling, Urdu in its own script, or
 * the two languages mixed mid-sentence. The question this set asks is whether
 * a model can still tell which answer is wanted, and, just as important, when
 * NONE of them is and a person should reply.
 *
 * ── HOW THE CASES ARE BUILT ──
 * Eight answers. For each one, three ways of asking:
 *
 *   direct    names the thing ("what are your prices?")
 *   indirect  never uses the obvious word ("how much would a small one set me back?")
 *   messy     how people type: short, misspelt, no punctuation
 *
 * Each of those in four forms: English, Roman Urdu, Urdu script, and mixed.
 * Then twelve messages that none of the answers covers, in the same four
 * forms. Sending any answer to those is a wrong answer.
 *
 * ── WHERE THE WORDING CAME FROM ──
 * The Roman Urdu, Urdu and mixed lines were drafted by an AI, then read by a
 * native Urdu speaker (Danish Javed, 2026-10-11), who judged them accurate.
 * That is one reader's read-through, not a line-by-line correction, and none
 * of these are real customer messages. Roman Urdu has no standard spelling;
 * the spellings here ("kitne", "kitnay", "kia", "kya", "hy", "hai") are a
 * sample of the range, not the whole of it. `reviewed` records which lines a
 * native speaker has read, and the runner prints the provenance with every
 * result so a number is never quoted without it.
 */

export type Lang = "en" | "roman" | "urdu" | "mixed";
export const LANGS: Lang[] = ["en", "roman", "urdu", "mixed"];
export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  roman: "Roman Urdu",
  urdu: "Urdu script",
  mixed: "Mixed",
};

export interface FaqEntry {
  id: string;
  /** What the owner would call it. */
  topic: string;
  /** The owner's answer, sent word for word. */
  answer: string;
  /**
   * The keywords an owner would plausibly set for a keyword auto-reply today.
   * English, because that is what the form invites. This is the baseline.
   */
  keywords: string[];
}

/** A home bakery in Karachi. Invented, but the shape is every small shop's. */
export const FAQ: FaqEntry[] = [
  {
    id: "prices",
    topic: "Prices",
    answer: "Our cakes start at Rs 2,500 for 1 pound and Rs 4,500 for 2 pounds. Cupcakes are Rs 250 each, minimum 6.",
    keywords: ["price", "prices", "cost", "rate", "how much"],
  },
  {
    id: "hours",
    topic: "Opening hours",
    answer: "We are open Monday to Saturday, 10am to 8pm. We are closed on Sundays.",
    keywords: ["open", "hours", "timing", "timings", "closed"],
  },
  {
    id: "location",
    topic: "Where we are",
    answer: "We are at Shop 4, Khayaban-e-Bukhari, DHA Phase 6, Karachi. Pickup is from the shop.",
    keywords: ["address", "location", "where", "shop", "pickup"],
  },
  {
    id: "delivery",
    topic: "Delivery",
    answer: "We deliver in DHA, Clifton, PECHS and Gulshan. Delivery is Rs 300. Orders placed before 2pm can be delivered the same day.",
    keywords: ["delivery", "deliver", "shipping", "home delivery"],
  },
  {
    id: "payment",
    topic: "How to pay",
    answer: "You can pay cash on delivery, by bank transfer, or with Easypaisa or JazzCash. We do not take cards.",
    keywords: ["payment", "pay", "cash", "card", "easypaisa", "jazzcash"],
  },
  {
    id: "custom",
    topic: "Custom cakes",
    answer: "Custom designs need 2 days' notice. Send us a picture of the design and the size you want, and we will confirm the price.",
    keywords: ["custom", "design", "customize", "theme", "birthday cake"],
  },
  {
    id: "dietary",
    topic: "Eggless and sugar-free",
    answer: "Eggless cakes are available on request at no extra charge. We do not make sugar-free cakes.",
    keywords: ["eggless", "egg", "sugar free", "sugar-free", "diabetic", "vegan"],
  },
  {
    id: "changes",
    topic: "Changing or cancelling an order",
    answer: "You can change or cancel an order up to 24 hours before pickup or delivery. After that the cake is already being made and we cannot refund it.",
    keywords: ["cancel", "refund", "change order", "change my order", "reschedule"],
  },
];

export const NONE = "none";

type Style = "direct" | "indirect" | "messy";
type InFourForms = Record<Lang, string>;

/** The three ways of asking, for one answer. */
const ASKING: Record<string, Record<Style, InFourForms>> = {
  prices: {
    direct: {
      en: "What are your cake prices?",
      roman: "Aap ke cake ki qeemat kya hai?",
      urdu: "آپ کے کیک کی قیمت کیا ہے؟",
      mixed: "Cake ke prices kya hain?",
    },
    indirect: {
      en: "How much would a small one set me back?",
      roman: "Chota wala kitne ka parega?",
      urdu: "چھوٹا والا کتنے کا پڑے گا؟",
      mixed: "Ek pound wala kitne ka hai?",
    },
    messy: {
      en: "hw much 2 pound",
      roman: "2 pond kitnay ka hy",
      urdu: "دو پاؤنڈ کتنے کا",
      mixed: "rate btao 2 pound ka",
    },
  },
  hours: {
    direct: {
      en: "What are your opening hours?",
      roman: "Aap ki dukaan kis waqt khulti hai?",
      urdu: "آپ کی دکان کس وقت کھلتی ہے؟",
      mixed: "Shop ki timings kya hain?",
    },
    indirect: {
      en: "Can I come by at 9 tonight?",
      roman: "Kya main raat 9 baje aa sakta hoon?",
      urdu: "کیا میں رات نو بجے آ سکتا ہوں؟",
      mixed: "Sunday ko aa sakti hoon?",
    },
    messy: {
      en: "u guys open rn?",
      roman: "abhi khuli hy dukan",
      urdu: "ابھی کھلا ہے",
      mixed: "open ho abhi?",
    },
  },
  location: {
    direct: {
      en: "What is your address?",
      roman: "Aap ka pata kya hai?",
      urdu: "آپ کا پتہ کیا ہے؟",
      mixed: "Shop ka address bhej dein",
    },
    indirect: {
      en: "How do I find you?",
      roman: "Aap tak kaise pohanchun?",
      urdu: "آپ تک کیسے پہنچوں؟",
      mixed: "Kahan se collect karna hai?",
    },
    messy: {
      en: "loc pls",
      roman: "kahan ho ap log",
      urdu: "کہاں ہیں آپ",
      mixed: "location send kro",
    },
  },
  delivery: {
    direct: {
      en: "Do you deliver?",
      roman: "Kya aap ghar par pohancha dete hain?",
      urdu: "کیا آپ گھر پر پہنچا دیتے ہیں؟",
      mixed: "Home delivery hai kya?",
    },
    indirect: {
      en: "Can you bring it to Clifton by this evening?",
      roman: "Aaj shaam tak Clifton bhijwa sakte hain?",
      urdu: "آج شام تک کلفٹن بھجوا سکتے ہیں؟",
      mixed: "Gulshan mein bhej dete ho? charges kitne hain",
    },
    messy: {
      en: "dlvry to pechs?",
      roman: "pechs tk aa jaega kya",
      urdu: "پی ای سی ایچ ایس تک آ جائے گا",
      mixed: "delivry krte ho dha me",
    },
  },
  payment: {
    direct: {
      en: "What payment methods do you accept?",
      roman: "Paise kaise dene hain?",
      urdu: "پیسے کیسے دینے ہیں؟",
      mixed: "Payment kaise karni hai?",
    },
    indirect: {
      en: "Is it okay if I settle up when it arrives?",
      roman: "Jab cake aaye tab paise de dun?",
      urdu: "جب کیک آئے تب پیسے دے دوں؟",
      mixed: "Easypaisa chalta hai?",
    },
    messy: {
      en: "cod available??",
      roman: "card se de skty hain",
      urdu: "کارڈ چلتا ہے",
      mixed: "jazzcash pe bhej dun",
    },
  },
  custom: {
    direct: {
      en: "Do you make custom cakes?",
      roman: "Kya aap apni marzi ka design bana dete hain?",
      urdu: "کیا آپ اپنی مرضی کا ڈیزائن بنا دیتے ہیں؟",
      mixed: "Custom design ka cake banate hain?",
    },
    indirect: {
      en: "I have a picture of what my daughter wants, can you do it for Saturday?",
      roman: "Meri beti ko jo chahiye uski tasveer hai, Saturday tak ban jaega?",
      urdu: "میری بیٹی کو جو چاہیے اس کی تصویر ہے، ہفتے تک بن جائے گا؟",
      mixed: "Spiderman theme ka cake chahiye, kitne din pehle batana hoga?",
    },
    messy: {
      en: "can u do unicorn one",
      roman: "tasveer wala bn jaega kya",
      urdu: "تصویر والا بن جائے گا",
      mixed: "pic bhejun design ki?",
    },
  },
  dietary: {
    direct: {
      en: "Do you have eggless cakes?",
      roman: "Kya baghair anday ka cake milta hai?",
      urdu: "کیا بغیر انڈے کا کیک ملتا ہے؟",
      mixed: "Eggless cake milega?",
    },
    indirect: {
      en: "My father is diabetic, is there anything he can have?",
      roman: "Mere abbu ko sugar hai, unke liye kuch hai?",
      urdu: "میرے ابو کو شوگر ہے، ان کے لیے کچھ ہے؟",
      mixed: "Sugar free option hai aap ke paas?",
    },
    messy: {
      en: "no egg one?",
      roman: "anda nhi khate hum",
      urdu: "انڈے کے بغیر",
      mixed: "bina egg k bna dein",
    },
  },
  changes: {
    direct: {
      en: "Can I cancel my order?",
      roman: "Kya main apna order mansookh kar sakta hoon?",
      urdu: "کیا میں اپنا آرڈر منسوخ کر سکتا ہوں؟",
      mixed: "Order cancel ho sakta hai?",
    },
    indirect: {
      en: "The party got moved, can we push it to next week?",
      roman: "Dawat agle hafte ho gayi hai, cake bhi agle hafte kar dein?",
      urdu: "دعوت اگلے ہفتے ہو گئی ہے، کیک بھی اگلے ہفتے کر دیں؟",
      mixed: "Party postpone ho gayi, date change kar sakte hain?",
    },
    messy: {
      en: "need 2 cancel, refund?",
      roman: "order nhi chahiye ab paisay wapis",
      urdu: "آرڈر نہیں چاہیے پیسے واپس",
      mixed: "cancel krna hy refund milega",
    },
  },
};

/** Messages none of the eight answers covers. Any answer sent to these is a wrong answer. */
const UNCOVERED: Array<{ why: string } & InFourForms> = [
  {
    why: "order status",
    en: "Where is my order? It was supposed to be here an hour ago.",
    roman: "Mera order kahan hai? Ek ghanta pehle aana tha.",
    urdu: "میرا آرڈر کہاں ہے؟ ایک گھنٹہ پہلے آنا تھا۔",
    mixed: "Mera order abhi tak nahi aya, rider kahan hai?",
  },
  {
    why: "complaint",
    en: "The cake arrived completely squashed. I want to speak to someone.",
    roman: "Cake bilkul kharab haalat mein aaya hai. Mujhe kisi se baat karni hai.",
    urdu: "کیک بالکل خراب حالت میں آیا ہے۔ مجھے کسی سے بات کرنی ہے۔",
    mixed: "Cake damage ho kar aya hai, manager se baat karwa dein.",
  },
  {
    why: "job enquiry",
    en: "Are you hiring? I am a trained baker.",
    roman: "Kya aap ke paas naukri hai? Main baking janti hoon.",
    urdu: "کیا آپ کے پاس نوکری ہے؟ میں بیکنگ جانتی ہوں۔",
    mixed: "Koi job vacancy hai aap ke paas?",
  },
  {
    why: "wholesale",
    en: "I run a cafe. Do you supply in bulk at wholesale rates?",
    roman: "Mera cafe hai. Kya aap thok mein maal dete hain?",
    urdu: "میرا کیفے ہے۔ کیا آپ تھوک میں مال دیتے ہیں؟",
    mixed: "Cafe ke liye wholesale supply karte hain?",
  },
  {
    why: "thanks",
    en: "Okay, thank you!",
    roman: "Theek hai, shukriya!",
    urdu: "ٹھیک ہے، شکریہ!",
    mixed: "Ok thanks, JazakAllah",
  },
  {
    why: "greeting",
    en: "Hello, good morning",
    roman: "Assalam o alaikum",
    urdu: "السلام علیکم",
    mixed: "Salam, hi",
  },
  {
    why: "compliment",
    en: "The cake was delicious, everyone loved it.",
    roman: "Cake bohat mazedar tha, sab ko pasand aaya.",
    urdu: "کیک بہت مزیدار تھا، سب کو پسند آیا۔",
    mixed: "Cake bohat tasty tha, sab ne tareef ki.",
  },
  {
    why: "recipe request",
    en: "Can you share the recipe for your chocolate fudge?",
    roman: "Chocolate fudge banane ka tareeqa bata dein?",
    urdu: "چاکلیٹ فج بنانے کا طریقہ بتا دیں؟",
    mixed: "Chocolate fudge ki recipe share kar dein?",
  },
  {
    why: "baking classes",
    en: "Do you run baking classes?",
    roman: "Kya aap baking sikhate hain?",
    urdu: "کیا آپ بیکنگ سکھاتے ہیں؟",
    mixed: "Baking classes hoti hain aap ke haan?",
  },
  {
    why: "invoice request",
    en: "I need a tax invoice with my company name on it.",
    roman: "Mujhe company ke naam ki raseed chahiye, tax wali.",
    urdu: "مجھے کمپنی کے نام کی رسید چاہیے، ٹیکس والی۔",
    mixed: "Company ke naam pe tax invoice bana dein.",
  },
  {
    why: "wrong number",
    en: "Is this the plumber? My tap is leaking.",
    roman: "Kya yeh plumber ka number hai? Nal se pani tapak raha hai.",
    urdu: "کیا یہ پلمبر کا نمبر ہے؟ نل سے پانی ٹپک رہا ہے۔",
    mixed: "Plumber sahab? tap leak ho raha hai.",
  },
  {
    why: "a product the answers do not mention",
    en: "Do you make sandwiches for office lunches?",
    roman: "Kya aap daftar ke khane ke liye sandwich banate hain?",
    urdu: "کیا آپ دفتر کے کھانے کے لیے سینڈوچ بناتے ہیں؟",
    mixed: "Office lunch ke liye sandwiches bana dete hain?",
  },
];

export interface Case {
  id: string;
  lang: Lang;
  /** How it was asked, or "uncovered" when no answer fits. */
  style: Style | "uncovered";
  message: string;
  /** The answer that should be sent, or NONE when a person should reply. */
  expect: string;
  /** True once a native speaker has read the wording. */
  reviewed: boolean;
}

export const CASES: Case[] = [];
for (const [entry, styles] of Object.entries(ASKING)) {
  for (const [style, forms] of Object.entries(styles) as Array<[Style, InFourForms]>) {
    for (const lang of LANGS) {
      CASES.push({ id: `${entry}/${style}/${lang}`, lang, style, message: forms[lang], expect: entry, reviewed: true });
    }
  }
}
for (const item of UNCOVERED) {
  for (const lang of LANGS) {
    CASES.push({
      id: `none/${item.why.replace(/\s+/g, "-")}/${lang}`,
      lang,
      style: "uncovered",
      message: item[lang],
      expect: NONE,
      reviewed: true,
    });
  }
}

/** How the non-English wording was produced. Printed with every result. */
export const PROVENANCE =
  "Non-English lines were drafted by an AI and read by one native Urdu speaker, who judged them accurate. " +
  "They are not real customer messages.";
