// Types and interfaces for form parsing and configuration
export type QuestionType =
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "linear_scale"
  | "short_text"
  | "paragraph"
  | "multiple_choice_grid"
  | "checkbox_grid"
  | "date"
  | "time"
  | "file_upload"
  | "unknown";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface GridQuestion {
  rows: string[];
  columns: string[];
}

export interface ScaleQuestion {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface ParsedQuestion {
  id: string;
  entryId: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  scale?: ScaleQuestion;
  grid?: GridQuestion;
  skipped?: boolean;
  skipReason?: string;
}

export interface ParsedForm {
  formId: string;
  title: string;
  description?: string;
  questions: ParsedQuestion[];
  isPublishedForm: boolean;
  requiresSignIn?: boolean;
  hasFileUpload?: boolean;
  skippedQuestions?: ParsedQuestion[];
  pageHistory: number[]; // Array of page IDs for multi-page forms
}

// Faker locale types and options
export type FakerLocale =
  | "en"
  | "en_IN"
  | "en_US"
  | "en_GB"
  | "en_AU"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pt_BR"
  | "ja"
  | "ko"
  | "zh_CN"
  | "ar"
  | "ru"
  | "nl"
  | "pl"
  | "tr";

export const LOCALE_OPTIONS: { value: FakerLocale; label: string }[] = [
  { value: "en", label: "English (General)" },
  { value: "en_IN", label: "English (India)" },
  { value: "en_US", label: "English (United States)" },
  { value: "en_GB", label: "English (Great Britain)" },
  { value: "en_AU", label: "English (Australia)" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "pt_BR", label: "Portuguese (Brazil)" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh_CN", label: "Chinese (China)" },
  { value: "ar", label: "Arabic" },
  { value: "ru", label: "Russian" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "tr", label: "Turkish" },
];

// Distribution types and interfaces for question answer generation
export type DistributionType =
  | "uniform"
  | "weighted"
  | "normal"
  | "skewed_left"
  | "skewed_right";

export interface OptionWeight {
  value: string;
  weight: number;
}

export interface QuestionDistribution {
  questionId: string;
  distributionType: DistributionType;
  weights?: OptionWeight[];
  mean?: number;
  std?: number;
  templates?: string[];
}

export interface FormConfiguration {
  form: ParsedForm;
  distributions: QuestionDistribution[];
  responseCount: number;
}

export interface SubmissionProgress {
  total: number;
  completed: number;
  failed: number;
  status: "idle" | "running" | "completed" | "error";
  currentResponse?: number;
  errors: string[];
}

export interface SubmissionResult {
  total: number;
  successful: number;
  failed: number;
  duration: number;
  errors: string[];
}