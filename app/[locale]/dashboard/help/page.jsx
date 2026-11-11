'use client';

import { useState } from 'react';
import {
  HelpCircle, Search, BookOpen, MessageCircle, Mail, Phone,
  ChevronDown, ChevronRight, FileText, Package,
  Wallet, BarChart3, Settings, Shield, Building2,
  Users, ShoppingCart, User,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROLE_LABELS } from '@/lib/utils';
import Card from '@/components/ui/Card';

// ✅ ሚና-ተኮር FAQ
const FAQS = {
  admin: [
    {
      question: 'እንዴት አዲስ ትዕዛዝ መፍጠር እችላለሁ?',
      answer: 'ወደ "ትዕዛዞች" ገጽ ይሂዱ እና "አዲስ ትዕዛዝ" የሚለውን ቁልፍ ይጫኑ። የደንበኛ መረጃ፣ የዕቃ ዓይነት፣ ብዛት እና ቀጠሮ ቀን ይሙሉ።',
    },
    {
      question: 'እንዴት የዕቃ ክምችት መጨመር እችላለሁ?',
      answer: 'ወደ "መጋዘን" ገጽ ይሂዱ እና "አዲስ ዕቃ ተቀበል" የሚለውን ቁልፍ ይጫኑ። የዕቃውን ዓይነት፣ ብዛት፣ ዋጋ እና አቅራቢ ያስገቡ።',
    },
    {
      question: 'ደረሰኝ እንዴት ማውጣት እችላለሁ?',
      answer: 'ወደ "ደረሰኞች" ገጽ ይሂዱ እና "አዲስ ደረሰኝ" የሚለውን ቁልፍ ይጫኑ። የትዕዛዙን ቁጥር በመምረጥ ደረሰኙን ማውጣት ይችላሉ።',
    },
    {
      question: 'የራሴን መገለጫ እንዴት መቀየር እችላለሁ?',
      answer: 'በላይኛው ቀኝ ጥግ ላይ ያለውን የፕሮፋይል ምስል ይጫኑ እና "የእኔ መገለጫ" የሚለውን ይምረጡ። "አስተካክል" የሚለውን ቁልፍ በመጫን መረጃዎን ያስተካክሉ።',
    },
    {
      question: 'የወርሃዊ ሪፖርት እንዴት ማየት እችላለሁ?',
      answer: 'ወደ "ትንተና" ገጽ ይሂዱ። እዚያ የዕለት፣ የሳምንት፣ የወር እና የዓመት ገቢ፣ ወጪ እና ትርፍ ማየት ይችላሉ።',
    },
    {
      question: 'የሠራተኛ ፈቃድ እንዴት መስጠት እችላለሁ?',
      answer: 'ወደ "ሠራተኞች" ገጽ ይሂዱ። የሠራተኛውን ረድፍ ያግኙ እና "አስተካክል" የሚለውን ቁልፍ ይጫኑ። በ"ፈቃዶች" ክፍል ውስጥ የሚፈልጉትን ፈቃድ ይምረጡ።',
    },
  ],
  seller: [
    {
      question: 'እንዴት አዲስ ትዕዛዝ መፍጠር እችላለሁ?',
      answer: 'ወደ "ትዕዛዞች" ገጽ ይሂዱ እና "አዲስ ትዕዛዝ" የሚለውን ቁልፍ ይጫኑ። የደንበኛ መረጃ፣ የዕቃ ዓይነት፣ ብዛት እና ቀጠሮ ቀን ይሙሉ።',
    },
    {
      question: 'እንዴት የዕቃ ክምችት መጨመር እችላለሁ?',
      answer: 'ወደ "መጋዘን" ገጽ ይሂዱ እና "አዲስ ዕቃ ተቀበል" የሚለውን ቁልፍ ይጫኑ። የዕቃውን ዓይነት፣ ብዛት፣ ዋጋ እና አቅራቢ ያስገቡ።',
    },
    {
      question: 'ደረሰኝ እንዴት ማውጣት እችላለሁ?',
      answer: 'ወደ "ደረሰኞች" ገጽ ይሂዱ እና "አዲስ ደረሰኝ" የሚለውን ቁልፍ ይጫኑ። የትዕዛዙን ቁጥር በመምረጥ ደረሰኙን ማውጣት ይችላሉ።',
    },
    {
      question: 'የራሴን መገለጫ እንዴት መቀየር እችላለሁ?',
      answer: 'በላይኛው ቀኝ ጥግ ላይ ያለውን የፕሮፋይል ምስል ይጫኑ እና "የእኔ መገለጫ" የሚለውን ይምረጡ። "አስተካክል" የሚለውን ቁልፍ በመጫን መረጃዎን ያስተካክሉ።',
    },
    {
      question: 'የወርሃዊ ሪፖርት እንዴት ማየት እችላለሁ?',
      answer: 'ወደ "ትንተና" ገጽ ይሂዱ። እዚያ የዕለት፣ የሳምንት፣ የወር እና የዓመት ገቢ፣ ወጪ እና ትርፍ ማየት ይችላሉ።',
    },
  ],
  customer: [
    // ✅ Customer ብቻ
    {
      question: 'እንዴት አዲስ ትዕዛዝ መፍጠር እችላለሁ?',
      answer: 'ወደ "ትዕዛዞች" ገጽ ይሂዱ እና "አዲስ ትዕዛዝ" የሚለውን ቁልፍ ይጫኑ። የዕቃ ዓይነት፣ ብዛት እና ቀጠሮ ቀን ይሙሉ።',
    },
    {
      question: 'ደረሰኔን እንዴት ማየት እችላለሁ?',
      answer: 'ወደ "ደረሰኞች" ገጽ ይሂዱ። እዚያ የእርስዎ ደረሰኞች ብቻ ይታያሉ። ደረሰኙን ለማተም የ "አትም" ቁልፍን ይጫኑ።',
    },
    {
      question: 'የገዛሁትን ምርቶች እንዴት ማየት እችላለሁ?',
      answer: 'ወደ "ምርቶች ታሪክ" ገጽ ይሂዱ። እዚያ የገዙት ምርቶች፣ የትዕዛዝ ቁጥር፣ ቀን እና ሁኔታ ይታያሉ።',
    },
    {
      question: 'የራሴን መገለጫ እንዴት መቀየር እችላለሁ?',
      answer: 'በላይኛው ቀኝ ጥግ ላይ ያለውን የፕሮፋይል ምስል ይጫኑ እና "የእኔ መገለጫ" የሚለውን ይምረጡ። "አስተካክል" የሚለውን ቁልፍ በመጫን መረጃዎን ያስተካክሉ።',
    },
    {
      question: 'የትዕዛዝ ሁኔታን እንዴት ማወቅ እችላለሁ?',
      answer: 'ወደ "የእኔ ትዕዛዞች" ገጽ ይሂዱ። እያንዳንዱ ትዕዛዝ ሁኔታውን (በመጠባበቅ/በምርት ላይ/ተዘጋጅቷል/ተላልፏል) ያሳያል።',
    },
  ],
};

// ✅ ሚና-ተኮር Quick Links
const QUICK_LINKS = {
  admin: [
    { label: 'ተጠቃሚዎች',  icon: Users,      href: '/dashboard/users',     desc: 'ተጠቃሚዎችን ያስተዳድሩ' },
    { label: 'ሠራተኞች',   icon: Users,      href: '/dashboard/employees', desc: 'ሠራተኞችን ያስተዳድሩ' },
    { label: 'ቅርንጫፎች',   icon: Building2,  href: '/dashboard/branches',  desc: 'ቅርንጫፎችን ያስተዳድሩ' },
    { label: 'ትንተና',      icon: BarChart3,  href: '/dashboard/analytics', desc: 'ሪፖርቶችን ይመልከቱ' },
    { label: 'ወጪዎች',      icon: Wallet,     href: '/dashboard/expenses',  desc: 'ወጪዎችን ያስተዳድሩ' },
    { label: 'ቅንብሮች',    icon: Settings,   href: '/dashboard/settings',  desc: 'ቅንብሮችን ያስተካክሉ' },
  ],
  seller: [
    { label: 'መጋዘን',     icon: Package,     href: '/dashboard/inventory', desc: 'ዕቃዎችን ያስተዳድሩ' },
    { label: 'ምርቶች',     icon: ShoppingCart, href: '/dashboard/products',  desc: 'ምርቶችን ያስተዳድሩ' },
    { label: 'ትዕዛዞች',    icon: FileText,    href: '/dashboard/orders',    desc: 'ትዕዛዞችን ያስተዳድሩ' },
    { label: 'ደረሰኞች',    icon: FileText,    href: '/dashboard/receipts',  desc: 'ደረሰኞችን ያውጡ' },
    { label: 'ትንተና',      icon: BarChart3,   href: '/dashboard/analytics', desc: 'ሪፖርቶችን ይመልከቱ' },
    { label: 'ወጪዎች',      icon: Wallet,      href: '/dashboard/expenses',  desc: 'ወጪዎችን ያስተዳድሩ' },
  ],
  customer: [
    // ✅ Customer ብቻ
    { label: 'የእኔ ትዕዛዞች', icon: FileText,    href: '/dashboard/orders',     desc: 'ትዕዛዞችዎን ይመልከቱ' },
    { label: 'ደረሰኞች',    icon: FileText,    href: '/dashboard/receipts',   desc: 'ደረሰኞችዎን ይመልከቱ' },
    { label: 'ምርቶች ታሪክ', icon: Package,     href: '/dashboard/my-products', desc: 'የገዙትን ምርቶች ይመልከቱ' },
    
  ],
};

export default function HelpPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const role = user?.role || 'customer';
  const roleLabel = ROLE_LABELS[role] || 'ተጠቃሚ';
  const quickLinks = QUICK_LINKS[role] || QUICK_LINKS.customer;
  const faqs = FAQS[role] || FAQS.customer;

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle size={28} className="text-brand" />
          እርዳታ
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ስለ ስርዓቱ አጠቃቀም የሚረዱ መረጃዎች
        </p>
      </div>

      {/* Welcome Card */}
      <Card padding="md" className="bg-gradient-to-br from-brand to-brand-dark text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <BookOpen size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">
              እንኳን ደህና መጡ, {user?.fullName?.split(' ')[0] || 'ተጠቃሚ'}! 👋
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              ይህ የእርዳታ ገጽ ስርዓቱን በቀላሉ ለመጠቀም የሚረዱ መረጃዎችን ይዟል።
              ከታች ያሉትን ፈጣን አገናኞች ወይም የሚጠየቁ ጥያቄዎችን ይመልከቱ።
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <Shield size={12} />
              የእርስዎ ሚና: {roleLabel}
            </div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <Card padding="md">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ጥያቄ ይፈልጉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
          />
        </div>
      </Card>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <ChevronRight size={18} className="text-brand" />
          ፈጣን አገናኞች
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={i}
                href={link.href}
                className="group p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-brand hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 group-hover:text-brand transition">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-brand transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MessageCircle size={18} className="text-brand" />
          ብዙ ጊዜ የሚጠየቁ ጥያቄዎች
        </h3>

        {filteredFaqs.length === 0 ? (
          <Card padding="md" className="text-center py-12">
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">ምንም ጥያቄ አልተገኘም</p>
            <p className="text-xs text-gray-400 mt-1">ሌላ ቃል ይሞክሩ</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden transition-all hover:border-gray-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle size={16} className="text-brand" />
                      </div>
                      <span className="font-medium text-gray-800">{faq.question}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 flex-shrink-0 ml-2 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pl-16">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Support */}
      <Card padding="md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Mail size={18} className="text-brand" />
          ተጨማሪ እርዳታ ይፈልጋሉ?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ጥያቄዎ ከላይ ካሉት መልሶች ውስጥ ካልተገኘ፣ እኛን ለማግኘት ከታች ያሉትን መንገዶች ይጠቀሙ።
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:0924254988"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand hover:bg-gray-50 transition group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:scale-110 transition">
              <Phone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">ስልክ</p>
              <p className="text-xs text-gray-500">0924 254 988</p>
            </div>
          </a>

          <a
            href="mailto:info@grumstove.com"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand hover:bg-gray-50 transition group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">ኢሜይል</p>
              <p className="text-xs text-gray-500">info@grumstove.com</p>
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
}
