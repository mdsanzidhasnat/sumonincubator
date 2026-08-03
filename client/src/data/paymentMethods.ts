export interface PaymentMethodInfo {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  brandColor: string;
  instructionEn: string;
  instructionBn: string;
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'bkash',
    name: 'bKash',
    nameBn: 'বিকাশ',
    category: 'Net Banking & Others',
    categoryBn: 'নেট ব্যাংকিং ও অন্যান্য',
    brandColor: '#E2136E',
    instructionEn:
      'Send ৳{amount} to bKash Personal Number {phone} (Sumon). After sending, tap "Payment" and confirm your order. Our team will verify and confirm shortly.',
    instructionBn:
      '{amount} টাকা বিকাশ পার্সোনাল নম্বর {phone} (সুমন) এ পাঠান। পাঠানোর পর "পেমেন্ট" করুন এবং অর্ডারটি কনফার্ম করুন। আমাদের টিম যাচাই করে শীঘ্রই কনফার্ম করবে।',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    nameBn: 'নগদ',
    category: 'Net Banking & Others',
    categoryBn: 'নেট ব্যাংকিং ও অন্যান্য',
    brandColor: '#F6921E',
    instructionEn:
      'Send ৳{amount} to Nagad Number {phone} (Sumon). After sending, tap "Payment" and confirm your order. Our team will verify and confirm shortly.',
    instructionBn:
      '{amount} টাকা নগদ নম্বর {phone} (সুমন) এ পাঠান। পাঠানোর পর "পেমেন্ট" করুন এবং অর্ডারটি কনফার্ম করুন। আমাদের টিম যাচাই করে শীঘ্রই কনফার্ম করবে।',
  },
  {
    id: 'citybank',
    name: 'City Bank',
    nameBn: 'সিটি ব্যাংক',
    category: 'Bank Transfer',
    categoryBn: 'ব্যাংক ট্রান্সফার',
    brandColor: '#005EB8',
    instructionEn:
      'Transfer ৳{amount} to City Bank account (Sumon\'s World). After transferring, send the transaction slip via WhatsApp to {phone} and confirm your order.',
    instructionBn:
      'সিটি ব্যাংক অ্যাকাউন্টে (সুমনস ওয়ার্ল্ড) {amount} টাকা ট্রান্সফার করুন। ট্রান্সফারের পর লেনদেনের স্লিপ {phone} নম্বরে হোয়াটসঅ্যাপে পাঠিয়ে অর্ডারটি কনফার্ম করুন।',
  },
  {
    id: 'card',
    name: 'Card Payment',
    nameBn: 'কার্ড পেমেন্ট',
    category: 'Card',
    categoryBn: 'কার্ড',
    brandColor: '#6B7280',
    instructionEn:
      'We accept Visa / Mastercard / Amex. For card payment, please contact our helpline at {phone} and our team will send you a secure payment link for ৳{amount}.',
    instructionBn:
      'আমরা ভিসা / মাস্টারকার্ড / আমেক্স গ্রহণ করি। কার্ড পেমেন্টের জন্য হেল্পলাইন {phone} নম্বরে যোগাযোগ করুন, আমাদের টিম {amount} টাকার জন্য একটি নিরাপদ পেমেন্ট লিংক পাঠাবে।',
  },
  {
    id: 'other',
    name: 'Other Payment Methods',
    nameBn: 'অন্যান্য পেমেন্ট মেথড',
    category: 'Other',
    categoryBn: 'অন্যান্য',
    brandColor: '#0F172A',
    instructionEn:
      'For any other payment method, please contact our helpline at {phone}. Our team will assist you with your ৳{amount} payment.',
    instructionBn:
      'অন্য যেকোনো পেমেন্ট মেথডের জন্য হেল্পলাইন {phone} নম্বরে যোগাযোগ করুন। আপনার {amount} টাকার পেমেন্টে আমাদের টিম সহায়তা করবে।',
  },
];
