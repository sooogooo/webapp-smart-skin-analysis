// types.ts

export type FormType = 'sensitive' | 'acne' | 'pigmentation' | 'anti-aging' | 'dry' | 'rosacea' | 'pigmentation_disorders' | 'dehydrated_skin' | 'combination_skin';

export type FormDataValue = string | string[] | Record<string, string | string[]>;
export type FormData = Record<string, FormDataValue>;

export interface FormQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'group';
  options?: { value: string; label: string }[];
  defaultValue?: string | string[];
  condition?: {
    id: string;
    value: string;
  };
  subQuestions?: FormQuestion[];
}

export interface FormSection {
  title: string;
  questions: FormQuestion[];
}

export interface FormStructure {
  title: string;
  thumbnail: string;
  sections: FormSection[];
}

export interface DiagnosisReport {
  diagnosis: string;
  plan: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
  formType?: FormType;
  date?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// FIX: Export TutorialStep interface for use in Tutorial component.
export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  before?: () => void;
}


export interface TreatmentItem {
  name: string;
  spec: string;
  price: number;
  ingredients?: string;
  effect: string;
  image: string;
}

export interface TreatmentCategory {
  name: string;
  notes?: string[];
  items: TreatmentItem[];
}

export type TreatmentMenu = TreatmentCategory[];