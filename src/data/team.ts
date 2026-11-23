/**
 * TEAM DATA: the only file you need to edit to update the Team section.
 *
 * - These are clearly marked PLACEHOLDERS. Replace them with real people; do not publish invented staff.
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
    id: 'member-1',
    name: { en: 'Team Member Name', ar: 'اسم عضو الفريق' },
    role: { en: 'Founder & Automation Lead', ar: 'المؤسس ومسؤول الأتمتة' },
    bio: {
      en: 'Placeholder biography. Replace this text with two short sentences about this person and what they do at Autoone.',
      ar: 'نبذة تجريبية. استبدل هذا النص بجملتين قصيرتين عن هذا الشخص ودوره في Autoone.',
    },
    expertise: { en: ['Business automation', 'AI agents'], ar: ['أتمتة الأعمال', 'وكلاء الذكاء الاصطناعي'] },
    photo: '',
    linkedin: '',
    instagram: '',
    x: '',
  },
  {
    id: 'member-2',
    name: { en: 'Team Member Name', ar: 'اسم عضو الفريق' },
    role: { en: 'Systems & Integrations Engineer', ar: 'مهندس الأنظمة والتكامل' },
    bio: {
      en: 'Placeholder biography. Replace this text with two short sentences about this person and what they do at Autoone.',
      ar: 'نبذة تجريبية. استبدل هذا النص بجملتين قصيرتين عن هذا الشخص ودوره في Autoone.',
    },
    expertise: { en: ['APIs', 'CRM integrations'], ar: ['واجهات البرمجة', 'ربط أنظمة العملاء'] },
    photo: '',
    linkedin: '',
    instagram: '',
    x: '',
  },
  {
    id: 'member-3',
    name: { en: 'Team Member Name', ar: 'اسم عضو الفريق' },
    role: { en: 'Customer Success & Support', ar: 'نجاح العملاء والدعم' },
    bio: {
      en: 'Placeholder biography. Replace this text with two short sentences about this person and what they do at Autoone.',
      ar: 'نبذة تجريبية. استبدل هذا النص بجملتين قصيرتين عن هذا الشخص ودوره في Autoone.',
    },
    expertise: { en: ['Onboarding', 'Technical support'], ar: ['التهيئة والإطلاق', 'الدعم الفني'] },
    photo: '',
    linkedin: '',
    instagram: '',
    x: '',
  },
]
