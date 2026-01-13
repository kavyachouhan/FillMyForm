"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  ParsedForm,
  QuestionDistribution,
  SubmissionProgress,
  SubmissionResult,
  FakerLocale,
} from "./types";

interface FormState {
  form: ParsedForm | null;
  distributions: QuestionDistribution[];
  responseCount: number;
  locale: FakerLocale;
  progress: SubmissionProgress;
  result: SubmissionResult | null;
}

interface FormContextType extends FormState {
  setForm: (form: ParsedForm | null) => void;
  setDistributions: (distributions: QuestionDistribution[]) => void;
  setResponseCount: (count: number) => void;
  setLocale: (locale: FakerLocale) => void;
  updateProgress: (progress: Partial<SubmissionProgress>) => void;
  setResult: (result: SubmissionResult | null) => void;
  reset: () => void;
}

const initialProgress: SubmissionProgress = {
  total: 0,
  completed: 0,
  failed: 0,
  status: "idle",
  errors: [],
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<ParsedForm | null>(null);
  const [distributions, setDistributions] = useState<QuestionDistribution[]>(
    []
  );
  const [responseCount, setResponseCount] = useState(10);
  const [locale, setLocale] = useState<FakerLocale>("en");
  const [progress, setProgress] = useState<SubmissionProgress>(initialProgress);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const updateProgress = (updates: Partial<SubmissionProgress>) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  };

  const reset = () => {
    setForm(null);
    setDistributions([]);
    setResponseCount(10);
    setLocale("en");
    setProgress(initialProgress);
    setResult(null);
  };

  return (
    <FormContext.Provider
      value={{
        form,
        distributions,
        responseCount,
        locale,
        progress,
        result,
        setForm,
        setDistributions,
        setResponseCount,
        setLocale,
        updateProgress,
        setResult,
        reset,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}