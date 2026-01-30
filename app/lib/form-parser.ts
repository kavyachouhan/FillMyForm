import { ParsedForm, ParsedQuestion, QuestionType, QuestionValidation, ValidationType } from "./types";

// Mapping of Google Forms question type codes to our QuestionType
const QUESTION_TYPE_MAP: Record<number, QuestionType> = {
  0: "short_text",
  1: "paragraph",
  2: "multiple_choice",
  3: "dropdown",
  4: "checkbox",
  5: "linear_scale",
  7: "multiple_choice_grid",
  8: "checkbox_grid",
  9: "date",
  10: "time",
  13: "file_upload",
};

// Mapping of Google Forms validation type codes
// Google Forms validation structure can vary:
// - entryData[0][4][0] contains the validation rule array
// - Or validation can be at entryData[0][4] directly
const VALIDATION_TYPE_MAP: Record<number, Record<number, ValidationType>> = {
  // Number validations (type 1)
  1: {
    1: "greater_than",
    2: "greater_equal",
    3: "less_than",
    4: "less_equal",
    5: "equal",
    6: "not_equal",
    7: "between",
    8: "not_between",
    9: "is_number",
    10: "whole_number",
  },
  // Text validations (type 2)
  2: {
    1: "contains",
    2: "not_contains",
    3: "email",
    4: "url",
  },
  // Length validations (type 3)
  3: {
    1: "length_max",
    2: "length_min",
    3: "length_equal",
  },
  // Regex validations (type 4)
  4: {
    1: "regex",
    2: "regex", // "Does not match" regex - treat same as regex
  },
  // Checkbox count validations (type 200)
  200: {
    1: "checkbox_min",
    2: "checkbox_max",
    3: "checkbox_exact",
  },
};

// Helper to extract validation from a rule array
function extractValidationFromRule(validationRule: unknown[], errorMessage?: string): QuestionValidation | undefined {
  if (!validationRule || !Array.isArray(validationRule) || validationRule.length < 2) {
    return undefined;
  }
  
  const validationCategory = validationRule[0] as number;
  const validationOperator = validationRule[1] as number;
  const primaryValue = validationRule[2];
  const secondaryValue = validationRule[3];
  
  const typeMap = VALIDATION_TYPE_MAP[validationCategory];
  if (!typeMap) return undefined;
  
  const validationType = typeMap[validationOperator];
  if (!validationType) return undefined;
  
  const validation: QuestionValidation = {
    type: validationType,
  };
  
  // Add values based on validation type
  if (primaryValue !== undefined && primaryValue !== null) {
    validation.value = primaryValue as number | string;
  }
  
  if (secondaryValue !== undefined && secondaryValue !== null && 
      (validationType === "between" || validationType === "not_between")) {
    validation.value2 = secondaryValue as number | string;
  }
  
  if (errorMessage) {
    validation.errorMessage = errorMessage;
  }
  
  return validation;
}

function parseValidation(entryData: unknown[]): QuestionValidation | undefined {
  try {
    // Validation data can be at different locations depending on the form structure
    const firstEntry = entryData[0] as unknown[];
    if (!firstEntry || !Array.isArray(firstEntry)) return undefined;
    
    // Check at index 4 for validation data
    const validationData = firstEntry[4] as unknown[];
    if (!validationData || !Array.isArray(validationData) || validationData.length === 0) {
      return undefined;
    }
    
    // Get the custom error message - can be at different locations
    let errorMessage: string | undefined;
    
    // Structure 1: validationData[0] is the rule array, validationData[1] is error message
    // Structure 2: validationData itself is the rule array
    // Structure 3: validationData contains nested arrays
    
    // First, check if validationData[0] looks like a validation rule (first element is a number category)
    const firstElement = validationData[0];
    
    if (typeof firstElement === 'number') {
      // This means validationData IS the rule itself
      return extractValidationFromRule(validationData, undefined);
    }
    
    if (Array.isArray(firstElement)) {
      // validationData[0] is the rule array
      // Check for error message at validationData[1]
      if (validationData[1] && typeof validationData[1] === 'string') {
        errorMessage = validationData[1];
      }
      return extractValidationFromRule(firstElement as unknown[], errorMessage);
    }
    
    // Try to find validation rule in nested structure
    for (let i = 0; i < validationData.length; i++) {
      const item = validationData[i];
      if (Array.isArray(item) && typeof item[0] === 'number') {
        // Found a rule-like array
        // Check next item for error message
        const nextItem = validationData[i + 1];
        if (typeof nextItem === 'string') {
          errorMessage = nextItem;
        }
        return extractValidationFromRule(item as unknown[], errorMessage);
      }
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

function extractFormIdFromUrl(url: string): string | null {
  // Trim whitespace from the URL
  const cleanUrl = url.trim();

  // Patterns to match published and editor form URLs
  const patterns = [
    /\/forms\/d\/e\/([a-zA-Z0-9_-]+)/,
    /\/forms\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      // Extracted form ID
      const formId = match[1].split("/")[0];
      return formId;
    }
  }

  return null;
}

interface ParseQuestionResult {
  question: ParsedQuestion | null;
  skipped: ParsedQuestion | null;
}

function parseQuestionData(questionData: unknown[]): ParseQuestionResult {
  try {
    // questionData structure:
    // [0]: question ID
    // [1]: title
    // [2]: description
    // [3]: type code
    // [4]: entry data array
    const title = questionData[1] as string;
    const description = questionData[2] as string | undefined;
    const typeCode = questionData[3] as number;
    const entryData = questionData[4] as unknown[];

    if (!entryData || !Array.isArray(entryData) || entryData.length === 0) {
      return { question: null, skipped: null };
    }

    const type = QUESTION_TYPE_MAP[typeCode] || "unknown";

    const firstEntry = entryData[0] as unknown[];
    if (!firstEntry || !Array.isArray(firstEntry)) {
      return { question: null, skipped: null };
    }

    const entryId = `entry.${firstEntry[0]}`;
    const required = firstEntry[4] === 1;

    // Handle file upload questions as skipped
    if (type === "file_upload") {
      return {
        question: null,
        skipped: {
          id: String(questionData[0]),
          entryId,
          title: title || "Untitled Question",
          description: description || undefined,
          type,
          required,
          skipped: true,
          skipReason: "File upload questions cannot be automated",
        },
      };
    }

    const question: ParsedQuestion = {
      id: String(questionData[0]),
      entryId,
      title: title || "Untitled Question",
      description: description || undefined,
      type,
      required,
    };

    // Parse validation rules if present
    const validation = parseValidation(entryData);
    if (validation) {
      question.validation = validation;
    }

    // Parse options for relevant question types
    if (
      type === "multiple_choice" ||
      type === "checkbox" ||
      type === "dropdown"
    ) {
      const optionsData = firstEntry[1] as unknown[][];
      if (optionsData && Array.isArray(optionsData)) {
        question.options = optionsData.map((opt: unknown[]) => ({
          value: String(opt[0]),
          label: String(opt[0]),
        }));
      }
    }

    if (type === "linear_scale") {
      const scaleData = firstEntry[1] as unknown[][];
      if (scaleData && Array.isArray(scaleData)) {
        const values = scaleData.map((s: unknown[]) => Number(s[0]));
        const labelData = firstEntry[3] as unknown[] | undefined;
        question.scale = {
          min: Math.min(...values),
          max: Math.max(...values),
          minLabel: labelData?.[0] as string | undefined,
          maxLabel: labelData?.[1] as string | undefined,
        };
        // Also set options as stringified values
        question.options = values.map((v) => ({
          value: String(v),
          label: String(v),
        }));
      }
    }

    if (type === "multiple_choice_grid" || type === "checkbox_grid") {
      // Extract rows and columns
      const rows: { label: string; entryId: string }[] = [];
      const columns: string[] = [];

      for (const entry of entryData as unknown[][]) {
        if (entry && Array.isArray(entry)) {
          // Rows are in the first element
          const rowEntryId = `entry.${entry[0]}`;
          const entryLabelData = entry[3] as unknown[] | undefined;
          const rowLabel =
            (entryLabelData?.[0] as string) || `Row ${rows.length + 1}`;
          rows.push({ label: rowLabel, entryId: rowEntryId });

          // Columns are in the second element
          if (columns.length === 0 && entry[1]) {
            const colData = entry[1] as unknown[][];
            if (Array.isArray(colData)) {
              colData.forEach((col: unknown[]) => {
                columns.push(String(col[0]));
              });
            }
          }
        }
      }

      question.grid = { rows, columns };
      question.options = columns.map((c) => ({
        value: c,
        label: c,
      }));
    }

    return { question, skipped: null };
  } catch {
    return { question: null, skipped: null };
  }
}

export function parseFormData(fbData: unknown[]): ParsedForm | null {
  try {
    // fbData structure:
    // [0]: metadata
    // [1]: form info array
    //   [0]: form description
    //   [1]: items array (can contain questions directly or page structures)
    //   [8]: form title
    //   [14]: form ID

    const formInfo = fbData[1] as unknown[];
    const itemsArray = formInfo?.[1] as unknown[][] | undefined;

    if (!formInfo || !itemsArray) {
      return null;
    }

    const formId = String(formInfo[14]) || String(formInfo[0]);
    const title = String(formInfo[8]) || "Untitled Form";
    const description = formInfo[0] as string | undefined;

    const questions: ParsedQuestion[] = [];
    const skippedQuestions: ParsedQuestion[] = [];
    const pageHistory: number[] = [0]; // Start with page 0 (first page)

    // Process each item in the form
    // Items can be:
    // 1. Direct questions (single-page forms)
    // 2. Page break/section headers
    // 3. Page structures containing questions (multi-page forms)
    for (const itemData of itemsArray) {
      if (!itemData || !Array.isArray(itemData)) continue;

      // Check if this is a page break/section header
      // A section header has:
      // - A title at index 1 (section name)
      // - Navigation info at index 11
      // - NO question entry data (index 4 is null or doesn't have entry structure)
      const hasNavigation = itemData[11] as unknown[] | undefined;
      const entryData = itemData[4] as unknown[] | undefined;
      const hasTitle = typeof itemData[1] === 'string' && itemData[1].length > 0;
      
      // It's a section break if it has navigation AND either no entry data 
      // or entry data doesn't look like a question (no entry ID at [4][0][0])
      const isQuestionEntry = entryData && 
        Array.isArray(entryData) && 
        entryData.length > 0 && 
        Array.isArray(entryData[0]) && 
        typeof (entryData[0] as unknown[])[0] === 'number';
      
      if (hasNavigation && Array.isArray(hasNavigation) && !isQuestionEntry) {
        // This is a section/page break - add the page index
        pageHistory.push(pageHistory.length);
        continue; // Skip to next item, this is just a section header
      }

      // First, try to parse as a direct question (single-page form structure)
      const directResult = parseQuestionData(itemData);
      if (directResult.question) {
        questions.push(directResult.question);
        continue;
      }
      if (directResult.skipped) {
        skippedQuestions.push(directResult.skipped);
        continue;
      }

      // Check if this item has nested question content at index 4
      // This happens with sections/pages where questions are nested inside
      const nestedContent = itemData[4] as unknown[][] | undefined;
      if (nestedContent && Array.isArray(nestedContent)) {
        for (const nestedItem of nestedContent) {
          if (!nestedItem || !Array.isArray(nestedItem)) continue;
          
          const nestedResult = parseQuestionData(nestedItem as unknown[]);
          if (nestedResult.question) {
            questions.push(nestedResult.question);
          }
          if (nestedResult.skipped) {
            skippedQuestions.push(nestedResult.skipped);
          }
        }
      }
    }

    return {
      formId,
      title,
      description: description || undefined,
      questions,
      skippedQuestions:
        skippedQuestions.length > 0 ? skippedQuestions : undefined,
      hasFileUpload: skippedQuestions.length > 0,
      isPublishedForm: false, // To be determined by URL/form ID
      pageHistory,
    };
  } catch {
    return null;
  }
}

export function extractFormId(url: string): string | null {
  return extractFormIdFromUrl(url);
}

function isPublishedFormId(formId: string): boolean {
  // Published form IDs often start with "1FAIpQL" or are longer than typical editor IDs
  return formId.startsWith("1FAIpQL") || formId.length > 50;
}

export function buildFormUrl(formId: string): string {
  // Determine if published or editor form
  if (isPublishedFormId(formId)) {
    return `https://docs.google.com/forms/d/e/${formId}/viewform`;
  }
  return `https://docs.google.com/forms/d/${formId}/viewform`;
}

export function buildSubmitUrl(formId: string): string {
  if (isPublishedFormId(formId)) {
    return `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  }
  return `https://docs.google.com/forms/d/${formId}/formResponse`;
}