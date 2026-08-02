import React from 'react';
import { MapPin, Phone, Mail, Award, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AboutContactViewsProps {
  view: 'about' | 'contact';
  lang: Language;
}

export const AboutContactViews: React.FC<AboutContactViewsProps> = ({ view, lang }) => {
  const [submitted, setSubmitted] = React.useState(false);
  if (view === 'about') {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sharp uppercase tracking-wider">
              {lang === 'bn' ? 'আমাদের ইতিহাস ও বিশ্বাস' : 'Our Brand Story'}
            </span>
            <h1 className="text-3xl font-black text-bismillah-bgDark">
              {lang === 'bn' ? 'সুমন ইনকিউবেটর সম্পর্কে' : 'About SumonIncubator'}
            </h1>
            <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
              {lang === 'bn'
                ? 'বাংলাদেশের পোল্ট্রি শিল্পকে আধুনিকায়ন করতে ২০১৮ সাল থেকে নিরলসভাবে কাজ করে যাচ্ছি।'
                : 'Pioneering smart, energy-efficient egg incubation and IPS power tech in Bangladesh since 2018.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-sharp border border-bismillah-borderLight text-center space-y-2">
              <Award className="w-8 h-8 text-bismillah-primaryGreen mx-auto" />
              <h3 className="text-base font-extrabold text-bismillah-bgDark">
                {lang === 'bn' ? '৯৮% হ্যাচিং গ্যারান্টি' : '98% Hatch Rate'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {lang === 'bn'
                  ? 'প্রতিটি ইনকিউবেটর ফ্যাক্টরিতে টেস্ট করার পর বাজারজাত করা হয়।'
                  : 'Rigorous 48-hour testing before shipping every incubator.'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-sharp border border-bismillah-borderLight text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-bismillah-primaryGreen mx-auto" />
              <h3 className="text-base font-extrabold text-bismillah-bgDark">
                {lang === 'bn' ? '১ বছর ওয়ারেন্টি' : '1 Year Replacement'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {lang === 'bn'
                  ? 'যেকোনো পার্টস নষ্ট হলে ১ বছর পর্যন্ত ফ্রি রিপ্লেসমেন্ট সুবিধা।'
                  : 'Hassle-free replacement policy for controllers and sensors.'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-sharp border border-bismillah-borderLight text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-bismillah-primaryGreen mx-auto" />
              <h3 className="text-base font-extrabold text-bismillah-bgDark">
                {lang === 'bn' ? '৬৪ জেলায় ডেলিভারি' : 'Nationwide Courier'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {lang === 'bn'
                  ? 'ক্যাশ অন ডেলিভারিতে স্টিডফাস্ট কুরিয়ারের মাধ্যমে পৌঁছানো হয়।'
                  : 'Safe door-step cash on delivery via trusted courier partners.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sharp uppercase tracking-wider">
            {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Helpline'}
          </span>
          <h1 className="text-3xl font-black text-bismillah-bgDark">
            {lang === 'bn' ? 'আমাদের সাথে যোগাযোগ' : 'Contact Us'}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {lang === 'bn'
              ? 'ইনকিউবেটর ও গ্যাজেট সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের হটলাইনে কল দিন।'
              : 'Our technical experts are standing by to guide your poultry setup.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-sharp border border-bismillah-borderLight space-y-4">
            <h3 className="text-base font-black text-bismillah-bgDark">
              {lang === 'bn' ? 'হেড অফিস ও শোরুম' : 'Head Office & Showroom'}
            </h3>
            <div className="space-y-3 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-bismillah-primaryGreen shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-bismillah-bgDark">Sumon Incubator Bangladesh</p>
                  <p>Plot 12, Road 4, Section 10, Mirpur, Dhaka-1216, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-bismillah-primaryGreen shrink-0" />
                <div>
                  <p className="font-bold text-bismillah-bgDark">Hotline Calls</p>
                  <p>01700-000000, 01900-123456</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-bismillah-primaryGreen shrink-0" />
                <div>
                  <p className="font-bold text-bismillah-bgDark">Official Email</p>
                  <p>info@sumonincubator.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Clock className="w-5 h-5 text-bismillah-primaryGreen shrink-0" />
                <div>
                  <p className="font-bold text-bismillah-bgDark">Working Hours</p>
                  <p>Sat - Thu: 9:00 AM - 9:00 PM (Friday Closed)</p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="bg-slate-50 p-6 rounded-sharp border border-bismillah-borderLight space-y-4 text-xs font-medium"
          >
            <h3 className="text-base font-black text-bismillah-bgDark">
              {lang === 'bn' ? 'সরাসরি মেসেজ পাঠান' : 'Send us a Message'}
            </h3>

            {submitted && (
              <div className="bg-emerald-50 text-bismillah-primaryGreen p-3 rounded-sharp border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-bismillah-primaryGreen shrink-0" />
                <span>
                  {lang === 'bn' ? 'ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাওয়া গেছে।' : 'Thank you! Your message has been sent.'}
                </span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
              </label>
              <input
                type="text"
                required
                className="w-full bg-white border border-bismillah-borderLight rounded-sharp p-2.5 outline-none focus:border-bismillah-primaryGreen"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                required
                className="w-full bg-white border border-bismillah-borderLight rounded-sharp p-2.5 outline-none focus:border-bismillah-primaryGreen"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {lang === 'bn' ? 'আপনার বার্তা' : 'Message'}
              </label>
              <textarea
                rows={3}
                required
                className="w-full bg-white border border-bismillah-borderLight rounded-sharp p-2.5 outline-none focus:border-bismillah-primaryGreen"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-extrabold py-3 rounded-sharp cursor-pointer"
            >
              {lang === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
