/**
 * TEAM DATA: the only file you need to edit to update the Team section.
 *
 * - Only publish what each person agreed to show: name, role, short bio and photo. Do not add personal phone numbers or emails here.
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
  linkedin: string
  instagram: string
  x: string
}

export const team: TeamMember[] = [
  {
    id: 'mohammed-alghoul',
    name: { en: 'Mohammed Alghoul', ar: 'محمد الغول' },
    role: { en: 'Founder & Technical Lead', ar: 'المؤسس والمسؤول التقني' },
    bio: {
      en: "Leads Autoone's technical work. Mohammed designs and builds the AI agents, automations and workflows that take repetitive tasks off your team's hands.",
      ar: 'يقود الجانب التقني في Autoone. يصمّم محمد ويبني وكلاء الذكاء الاصطناعي وأنظمة الأتمتة وسير العمل التي ترفع عن فريقك المهام المتكررة.',
    },
    expertise: { en: ['AI agents', 'AI automation', 'Workflows'], ar: ['وكلاء الذكاء الاصطناعي', 'الأتمتة بالذكاء الاصطناعي', 'سير العمل'] },
    photo: '/team/mohammed-alghoul.webp',
    linkedin: '',
    instagram: '',
    x: '',
  },
  {
    id: 'ameer-elhella',
    name: { en: 'Ameer Elhella', ar: 'أمير الهلة' },
    role: { en: 'Co-founder', ar: 'شريك مؤسس' },
    bio: {
      en: 'Co-founder of Autoone. Ameer leads how we turn a business problem into a working automated system, from understanding your process to a solution your team actually uses.',
      ar: 'شريك مؤسس في Autoone. يقود أمير عملية تحويل مشكلة العمل إلى نظام مؤتمت يعمل فعلاً، من فهم طريقة عمل شركتك إلى حل يستخدمه فريقك.',
    },
    expertise: { en: ['Solution design', 'Business automation'], ar: ['تصميم الحلول', 'أتمتة الأعمال'] },
    photo: '/team/ameer-elhella.webp',
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
    linkedin: '',
    instagram: '',
    x: '',
  },
]
