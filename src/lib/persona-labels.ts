import { Briefcase, Layers, Store, UserRound, type LucideIcon } from "lucide-react";

export type AdminPersona = "freelanceGig" | "smallBusiness" | "payeSideIncome" | "multiStream";

export type AdminPersonaOption = {
  id: AdminPersona;
  /** Short label for tabs */
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const ADMIN_PERSONA_OPTIONS: AdminPersonaOption[] = [
  {
    id: "freelanceGig",
    label: "Freelance & gig",
    title: "Freelance & gig income",
    description: "Fees, retainers, and platform payouts — keywords that mark taxable inflows vs noise.",
    Icon: Briefcase,
  },
  {
    id: "smallBusiness",
    label: "Small business",
    title: "Small business or trade",
    description: "Shop, studio, or buying-and-selling language for sales and costs.",
    Icon: Store,
  },
  {
    id: "payeSideIncome",
    label: "Salary + side",
    title: "Salary with side income",
    description: "PAYE salary plus occasional freelance, rent, or commission cues.",
    Icon: UserRound,
  },
  {
    id: "multiStream",
    label: "Multi-stream",
    title: "Several income streams",
    description: "Mixed salary, business, and other earners in one statement bank.",
    Icon: Layers,
  },
];

export function adminPersonaOption(id: AdminPersona): AdminPersonaOption {
  return ADMIN_PERSONA_OPTIONS.find((option) => option.id === id) ?? ADMIN_PERSONA_OPTIONS[0];
}
