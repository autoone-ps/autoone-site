import {
  AudioLines, BellRing, Bot, Brain, CalendarCheck, CalendarClock, CalendarPlus, ClipboardList, Cog,
  Database, FileBarChart, GitMerge, LayoutDashboard, type LucideIcon, Mail, MessageSquare, Network,
  PhoneCall, PhoneIncoming, Plug, Save, Search, ShieldCheck, Sparkles, UserRoundCheck, Workflow, Zap,
} from 'lucide-react'

export type ServiceId = 'call' | 'assistant' | 'booking' | 'chatbot' | 'systems' | 'automation'
export type Pose = 'main' | 'wave' | 'point' | 'think' | 'celebrate'

export interface ServiceMeta {
  id: ServiceId
  icon: LucideIcon
  /** Mascot pose used when this service is open in the explorer. */
  pose: Pose
  /** One icon per workflow step (6 steps). Text lives in the i18n files. */
  flowIcons: LucideIcon[]
}

/** Order here = order on the page. Titles, descriptions and features are in src/i18n. */
export const services: ServiceMeta[] = [
  { id: 'call', icon: PhoneCall, pose: 'wave', flowIcons: [PhoneIncoming, Brain, Database, AudioLines, Save, BellRing] },
  { id: 'assistant', icon: Bot, pose: 'think', flowIcons: [MessageSquare, Brain, Search, ClipboardList, UserRoundCheck, Plug] },
  { id: 'booking', icon: CalendarCheck, pose: 'point', flowIcons: [CalendarPlus, ShieldCheck, CalendarCheck, Mail, CalendarClock, BellRing] },
  { id: 'chatbot', icon: MessageSquare, pose: 'wave', flowIcons: [MessageSquare, Brain, Database, Sparkles, Save, BellRing] },
  { id: 'systems', icon: Network, pose: 'think', flowIcons: [Plug, ShieldCheck, Database, GitMerge, LayoutDashboard, UserRoundCheck] },
  { id: 'automation', icon: Workflow, pose: 'point', flowIcons: [Zap, Workflow, Cog, Brain, Plug, FileBarChart] },
]
