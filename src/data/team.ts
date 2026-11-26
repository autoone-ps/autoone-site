/**
 * TEAM DATA: the only file you need to edit to update the Team section.
 *
 * - `email` / `phone` are shown publicly on the card. Fill them only with details the person agreed to publish (empty = hidden). Phone in international format.
 * - Add a member = add one object. Remove a member = delete one object.
 * - `photo`: path of an image in /public (e.g. '/team/sara.jpg') or a full URL. Empty = neutral avatar.
 * - `linkedin` / `instagram` / `x`: full URLs. Empty = the icon is hidden.
 * - Every text field has English (en) and Arabic (ar).
 */
export interface TeamMember {
  id: string
  name: { en: string; ar: string }
  role: { en: string; ar: string }
  bio: { en: string; ar: string }
  expertise: { en: string[]; ar: string[] }
  photo: string
  email: string
  phone: string
  linkedin: string
  instagram: string
  x: string
}

export const team: TeamMember[] = [
  {
    id: 'mohammed-alghoul',
    name: { en: 'Mohammed Alghoul', ar: 'محمد الغول' },
    role: { en: 'Founder', ar: 'مؤسس' },
    bio: {
      en: "Founder and technical lead at Autoone. Mohammed designs and builds the AI agents, automations and workflows that take repetitive tasks off your team's hands.",
      ar: 'مؤسس ومسؤول الجانب التقني في Autoone. يصمّم محمد ويبني وكلاء الذكاء الاصطناعي وأنظمة الأتمتة وسير العمل التي ترفع عن فريقك المهام المتكررة.',
    },
    expertise: { en: ['AI agents', 'AI automation', 'Workflows'], ar: ['وكلاء الذكاء الاصطناعي', 'الأتمتة بالذكاء الاصطناعي', 'سير العمل'] },
    photo: '/team/mohammed-alghoul.webp',
    email: 'mohammed.alghoul.ai@gmail.com',
    phone: '+972 56 613 0415',
    linkedin: '',
    instagram: '',
    x: '',
  },
  {
    id: 'ameer-elhella',
    name: { en: 'Ameer Elhella', ar: 'أمير الحيلة' },
    role: { en: 'Founder', ar: 'مؤسس' },
    bio: {
      en: 'Founder of Autoone. Ameer leads how we turn a business problem into a working automated system, from understanding your process to a solution your team actually uses.',
      ar: 'مؤسس Autoone. يقود أمير عملية تحويل مشكلة العمل إلى نظام مؤتمت يعمل فعلاً، من فهم طريقة عمل شركتك إلى حل يستخدمه فريقك.',
    },
    expertise: { en: ['Solution design', 'Business automation'], ar: ['تصميم الحلول', 'أتمتة الأعمال'] },
    photo: '/team/ameer-elhella.webp',
    email: 'ameerelhella@gmail.com',
    phone: '+970 599 792 682',
    linkedin: '',
    instagram: '',
    x: '',
  },
  {
    id: 'fireal-salama',
    name: { en: 'Fireal Salama', ar: 'فريال سلامة' },
    role: { en: 'Social Media Manager', ar: 'مديرة وسائل التواصل الاجتماعي' },
    bio: {
      en: "Runs Autoone's social media presence. Fireal keeps our content and community moving, so the brand stays active and close to its audience.",
      ar: 'تدير حضور Autoone على وسائل التواصل الاجتماعي. تحرص فريال على استمرار المحتوى والتفاعل مع المجتمع، ليبقى حضورنا نشطاً وقريباً من جمهورنا.',
    },
    expertise: { en: ['Social media', 'Content', 'Community'], ar: ['وسائل التواصل', 'المحتوى', 'إدارة المجتمع'] },
    photo: '/team/fireal-salama.webp',
    email: 'fullasalama9@gmail.com',
    phone: '+972 592 374 984',
    linkedin: '',
    instagram: '',
    x: '',
  },
]
