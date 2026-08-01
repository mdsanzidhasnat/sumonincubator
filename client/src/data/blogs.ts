import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-01',
    title: 'Complete Guide to Maintaining Optimum Hatching Temperature & Humidity',
    titleBn: 'ডিম হ্যাচিংয়ের সঠিক তাপমাত্রা ও আর্দ্রতা নিয়ন্ত্রণ নির্দেশিকা',
    category: 'Incubator Tips',
    categoryBn: 'ইনকিউবেটর টিপস',
    date: '24 July, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
    author: 'Engr. Rakibul Hasan',
    excerpt: 'Learn how to set 37.5°C temperature and 60-70% humidity using XM-18 controllers to achieve over 95% hatching success rate.',
    excerptBn: 'ইনকিউবেটরে ডিম ফুটানোর জন্য ৩৭.৫° সে. তাপমাত্রা এবং সঠিক আর্দ্রতা বজায় রাখা কেন জরুরি এবং কীভাবে XM-18 সেটআপ করবেন।',
    contentBn: [
      'ইনকিউবেটরে ডিম ফুটাতে তাপমাত্রা এবং আর্দ্রতা সবচেয়ে গুরুত্বপূর্ণ দুটি উপাদান। মুরগির ডিমের ক্ষেত্রে প্রথম ১৮ দিন ৩৭.৫° সেলসিয়াস থেকে ৩৭.৮° সেলসিয়াস তাপমাত্রা বজায় রাখতে হয়।',
      'আর্দ্রতা প্রথম ১৮ দিন ৫৫% থেকে ৬০% এর মধ্যে থাকা প্রয়োজন এবং শেষ ৩ দিন (১৮-২১ দিন) আর্দ্রতা বাড়িয়ে ৬৫% থেকে ৭০% করতে হবে যাতে খোসা নরম হয় এবং বাচ্চার ফুটাতে সুবিধা হয়।',
      'আমাদের SUMON Pro সিরিজে থাকা আল্ট্রাসনিক ফগার ব্যবহার করলে আপনি খুব সহজেই স্বয়ংক্রিয়ভাবে সঠিক আর্দ্রতা বজায় রাখতে পারবেন।'
    ]
  },
  {
    id: 'blog-02',
    title: 'XM-18 Incubator Controller Wiring & Calibration Step-by-Step',
    titleBn: 'XM-18 ইনকিউবেটর কন্ট্রোলার ওয়ারিং ও ক্যালিব্রেশন গাইড',
    category: 'DIY & Maintenance',
    categoryBn: 'ইনকিউবেটর টেকনোলজি',
    date: '18 July, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    author: 'Tech Support Team',
    excerpt: 'Detailed wiring diagram and troubleshooting guide for XM-18 thermostat relays, turning motor timing, and alarm buzzers.',
    excerptBn: 'XM-18 কন্ট্রোলারের ওয়ারিং কানেকশন ডায়াগ্রাম, ফ্যান, হিটার এবং মোটর টাইমার সেটআপের বাংলা বিস্তারিত গাইড।',
    contentBn: [
      'XM-18 মাইক্রো-কম্পিউটার কন্ট্রোলারটি যেকোনো ইনকিউবেটরের ব্রেইন হিসেবে কাজ করে। এতে মোট ২৪টি টার্মিনাল কানেকশন পয়েন্ট থাকে।',
      '১ ও ২ নম্বর পয়েন্টে বিদ্যুৎ ইনপুট (220V AC), ৩ ও ৪ নম্বর পয়েন্টে মেইন হিটার এবং ১৩ ও ১৪ নম্বর পয়েন্টে ডিম ঘোরানোর মোটর কানেক্ট করতে হয়।',
      'প্রতি মাসে একবার সেন্সর পরিষ্কার করে শুকনা কাপড়ে মুছে দিলে সঠিক তাপমাত্রা রিডিং পাওয়া সম্ভব।'
    ]
  },
  {
    id: 'blog-03',
    title: 'Best Practices to Extend Tubular IPS Battery Life in Bangladesh Climate',
    titleBn: 'আইপিএস ও সোলার ব্যাটারি দীর্ঘদিন টিকিয়ে রাখার সেরা টিপস',
    category: 'Power & IPS',
    categoryBn: 'আইপিএস ও পাওয়ার গাইড',
    date: '10 July, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    author: 'SUMON Electronics Lab',
    excerpt: 'Essential maintenance rules for IPS tubular batteries: distilled water topping, terminal corrosion cleaning, and depth of discharge.',
    excerptBn: 'গ্রীষ্মকালে ঘন ঘন লোডশেডিংয়ে আইপিএস ব্যাটারিতে পানি দেওয়া এবং ভোল্টেজ ঠিক রাখার অত্যন্ত গুরুত্বপূর্ণ কিছু পরামর্শ।',
    contentBn: [
      'বাংলাদেশের আবহাওয়ায় টিউবুলার ব্যাটারির স্থায়িত্ব বাড়াতে প্রতি ২-৩ মাস পর পর ডিস্টিল্ড ওয়াটার ওয়াটার লেভেল চেক করা অত্যন্ত জরুরী।',
      'ব্যাটারির টার্মিনালে কখনো এসিড জমতে দেওয়া যাবে না। হালকা কুসুম গরম পানি দিয়ে নিয়মিত পরিষ্কার রাখতে হবে।',
      'সুমন পিওর সাইন ওয়েভ আইপিএস ব্যবহার করলে ব্যাটারি ওভারচার্জ হওয়া বন্ধ থাকে এবং ব্যাটারির আয়ু দ্বিগুণ বৃদ্ধি পায়।'
    ]
  }
];
