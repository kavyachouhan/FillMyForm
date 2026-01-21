import { NextRequest, NextResponse } from "next/server";
import { Faker, allLocales, base, en } from "@faker-js/faker";
import {
  ParsedQuestion,
  QuestionDistribution,
  DistributionType,
  FakerLocale,
  QuestionValidation,
} from "@/app/lib/types";

interface SubmitRequestBody {
  formId: string;
  questions: ParsedQuestion[];
  distributions: QuestionDistribution[];
  responseIndex: number;
  isPublishedForm: boolean;
  locale: FakerLocale;
  pageHistory: number[]; // Array of page IDs for the form
  skipOptionalQuestions: boolean; // Whether to skip optional questions
}

// Create a Faker instance with the specified locale
function createFaker(locale: FakerLocale): Faker {
  const localeData = allLocales[locale];
  if (localeData) {
    return new Faker({ locale: [localeData, en, base] });
  }
  return new Faker({ locale: [en, base] });
}

// Select an option based on weights
function weightedChoice<T>(options: T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * total;

  for (let i = 0; i < options.length; i++) {
    random -= weights[i];
    if (random <= 0) return options[i];
  }

  return options[options.length - 1];
}

function gaussian(mean: number, std: number): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Generate a number respecting validation constraints
function generateValidatedNumber(
  validation: QuestionValidation | undefined,
  faker: Faker,
  defaultMin: number = 1,
  defaultMax: number = 100
): number {
  let min = defaultMin;
  let max = defaultMax;
  let mustBeWhole = false;
  
  if (validation) {
    const val = validation.value !== undefined ? Number(validation.value) : undefined;
    const val2 = validation.value2 !== undefined ? Number(validation.value2) : undefined;
    
    switch (validation.type) {
      case "greater_than":
        if (val !== undefined) min = val + 1;
        break;
      case "greater_equal":
        if (val !== undefined) min = val;
        break;
      case "less_than":
        if (val !== undefined) max = val - 1;
        break;
      case "less_equal":
        if (val !== undefined) max = val;
        break;
      case "equal":
        if (val !== undefined) return val;
        break;
      case "not_equal":
        // Generate a number that's not equal to the specified value
        if (val !== undefined) {
          let result: number;
          do {
            result = faker.number.int({ min, max });
          } while (result === val && max - min > 0);
          return result;
        }
        break;
      case "between":
        if (val !== undefined && val2 !== undefined) {
          min = Math.min(val, val2);
          max = Math.max(val, val2);
        }
        break;
      case "not_between":
        // Generate a number outside the range
        if (val !== undefined && val2 !== undefined) {
          const rangeMin = Math.min(val, val2);
          const rangeMax = Math.max(val, val2);
          // Randomly choose to go below or above the range
          if (Math.random() < 0.5 && rangeMin > defaultMin) {
            max = rangeMin - 1;
          } else {
            min = rangeMax + 1;
          }
        }
        break;
      case "whole_number":
        mustBeWhole = true;
        break;
    }
  }
  
  // Ensure min <= max
  if (min > max) {
    [min, max] = [max, min];
  }
  
  if (mustBeWhole) {
    return faker.number.int({ min: Math.ceil(min), max: Math.floor(max) });
  }
  
  return faker.number.int({ min, max });
}

// Generate a string respecting text/length validation constraints
function generateValidatedText(
  validation: QuestionValidation | undefined,
  faker: Faker,
  baseText?: string,
  minLength?: number
): string {
  // If no validation, ensure minimum length if specified
  if (!validation) {
    let text = baseText || faker.lorem.words({ min: 2, max: 5 });
    if (minLength && text.length < minLength) {
      while (text.length < minLength) {
        text += " " + faker.lorem.word();
      }
    }
    return text;
  }
  
  const val = validation.value !== undefined ? Number(validation.value) : undefined;
  
  switch (validation.type) {
    case "email":
      return faker.internet.email();
    case "url":
      return faker.internet.url();
    case "length_max":
      if (val !== undefined) {
        let text = baseText || faker.lorem.words({ min: 1, max: 3 });
        // Ensure we don't exceed max length
        if (text.length > val) {
          text = text.substring(0, val);
        }
        return text;
      }
      break;
    case "length_min":
      if (val !== undefined) {
        let text = baseText || faker.lorem.words({ min: 3, max: 10 });
        // Ensure we meet minimum length
        while (text.length < val) {
          text += " " + faker.lorem.word();
        }
        return text;
      }
      break;
    case "length_equal":
      if (val !== undefined) {
        // Generate text of exact length
        let text = "";
        while (text.length < val) {
          const word = faker.lorem.word();
          if (text.length + word.length + 1 <= val) {
            text += (text.length > 0 ? " " : "") + word;
          } else {
            // Fill remaining with characters
            const remaining = val - text.length;
            if (remaining > 0) {
              text += faker.string.alpha(remaining);
            }
            break;
          }
        }
        return text.substring(0, val);
      }
      break;
    case "contains":
      if (validation.value && typeof validation.value === "string") {
        const words = faker.lorem.words({ min: 1, max: 3 });
        return `${words} ${validation.value} ${faker.lorem.words({ min: 1, max: 2 })}`;
      }
      break;
    case "not_contains":
      // Just generate normal text, unlikely to contain the specific string
      return baseText || faker.lorem.words({ min: 2, max: 5 });
    case "regex":
      // Regex validation is complex, return base text and hope it matches
      // In practice, users would need to provide custom templates for regex
      return baseText || faker.lorem.words({ min: 2, max: 5 });
  }
  
  return baseText || faker.lorem.words({ min: 2, max: 5 });
}

// Generate checkbox selections respecting count validation constraints
function generateValidatedCheckboxSelections(
  options: string[],
  validation: QuestionValidation | undefined
): string[] {
  if (options.length === 0) return [];
  
  let minSelections = 1;
  let maxSelections = Math.min(3, options.length);
  let exactSelections: number | undefined;
  
  if (validation) {
    const val = validation.value !== undefined ? Number(validation.value) : undefined;
    
    switch (validation.type) {
      case "checkbox_min":
        if (val !== undefined) minSelections = Math.min(val, options.length);
        break;
      case "checkbox_max":
        if (val !== undefined) maxSelections = Math.min(val, options.length);
        break;
      case "checkbox_exact":
        if (val !== undefined) exactSelections = Math.min(val, options.length);
        break;
    }
  }
  
  // Ensure minSelections <= maxSelections
  if (minSelections > maxSelections) {
    minSelections = maxSelections;
  }
  
  const count = exactSelections ?? 
    (minSelections + Math.floor(Math.random() * (maxSelections - minSelections + 1)));
  
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate contextual paragraph responses based on question title
function generateContextualParagraph(title: string, faker: Faker): string {
  const lowerTitle = title.toLowerCase();
  
  // Opinion/feedback questions
  if (lowerTitle.includes("opinion") || lowerTitle.includes("think") || lowerTitle.includes("feel") || 
      lowerTitle.includes("thoughts") || lowerTitle.includes("view")) {
    const opinionStarters = [
      "In my opinion,",
      "I believe that",
      "From my perspective,",
      "I think that",
      "Based on my experience,",
      "I feel that",
    ];
    const starter = opinionStarters[Math.floor(Math.random() * opinionStarters.length)];
    return `${starter} this is an important topic that deserves careful consideration. ${faker.lorem.sentences({ min: 2, max: 4 })}`;
  }
  
  // Experience questions
  if (lowerTitle.includes("experience") || lowerTitle.includes("describe") || lowerTitle.includes("tell us about")) {
    const experienceStarters = [
      "In my experience,",
      "I have found that",
      "Over the years,",
      "From what I've seen,",
      "Based on my past experiences,",
    ];
    const starter = experienceStarters[Math.floor(Math.random() * experienceStarters.length)];
    return `${starter} ${faker.lorem.sentences({ min: 2, max: 4 })} This has helped me understand the importance of continuous learning and adaptation.`;
  }
  
  // Suggestion/improvement questions  
  if (lowerTitle.includes("suggest") || lowerTitle.includes("improve") || lowerTitle.includes("recommendation") ||
      lowerTitle.includes("better") || lowerTitle.includes("change")) {
    const suggestionStarters = [
      "I would suggest",
      "One improvement could be",
      "I recommend",
      "A possible enhancement would be",
      "To make things better,",
    ];
    const starter = suggestionStarters[Math.floor(Math.random() * suggestionStarters.length)];
    return `${starter} focusing on user experience and efficiency. ${faker.lorem.sentences({ min: 2, max: 3 })} This would lead to better outcomes overall.`;
  }
  
  // Reason/why questions
  if (lowerTitle.includes("why") || lowerTitle.includes("reason") || lowerTitle.includes("explain")) {
    const reasonStarters = [
      "The main reason is",
      "This is because",
      "The primary factor is",
      "I believe this happens because",
      "The explanation for this is",
    ];
    const starter = reasonStarters[Math.floor(Math.random() * reasonStarters.length)];
    return `${starter} ${faker.lorem.sentences({ min: 2, max: 4 })}`;
  }
  
  // How questions
  if (lowerTitle.includes("how")) {
    const howStarters = [
      "The process involves",
      "This can be achieved by",
      "The approach I would take is",
      "The way I see it,",
      "One effective method is",
    ];
    const starter = howStarters[Math.floor(Math.random() * howStarters.length)];
    return `${starter} ${faker.lorem.sentences({ min: 2, max: 4 })}`;
  }
  
  // Challenge/problem questions
  if (lowerTitle.includes("challenge") || lowerTitle.includes("problem") || lowerTitle.includes("difficulty") ||
      lowerTitle.includes("obstacle") || lowerTitle.includes("issue")) {
    const challengeStarters = [
      "One of the main challenges is",
      "A significant issue is",
      "The biggest difficulty I've faced is",
      "A common problem is",
      "One obstacle that stands out is",
    ];
    const starter = challengeStarters[Math.floor(Math.random() * challengeStarters.length)];
    return `${starter} managing time effectively while maintaining quality. ${faker.lorem.sentences({ min: 2, max: 3 })} However, with proper planning, these challenges can be overcome.`;
  }
  
  // Goal/aspiration questions
  if (lowerTitle.includes("goal") || lowerTitle.includes("aspir") || lowerTitle.includes("hope") ||
      lowerTitle.includes("plan") || lowerTitle.includes("future") || lowerTitle.includes("aim")) {
    const goalStarters = [
      "My main goal is",
      "I aspire to",
      "In the future, I hope to",
      "My plan is to",
      "I aim to",
    ];
    const starter = goalStarters[Math.floor(Math.random() * goalStarters.length)];
    return `${starter} achieve meaningful progress in this area. ${faker.lorem.sentences({ min: 2, max: 3 })} This will require dedication and consistent effort.`;
  }
  
  // Feedback questions
  if (lowerTitle.includes("feedback") || lowerTitle.includes("comment") || lowerTitle.includes("review")) {
    const feedbackStarters = [
      "Overall, I found the experience to be",
      "My feedback would be",
      "I would like to comment that",
      "In terms of feedback,",
      "My overall impression is",
    ];
    const starter = feedbackStarters[Math.floor(Math.random() * feedbackStarters.length)];
    return `${starter} positive and constructive. ${faker.lorem.sentences({ min: 2, max: 3 })} There's always room for improvement, but the foundation is solid.`;
  }
  
  // Interest/motivation questions
  if (lowerTitle.includes("interest") || lowerTitle.includes("motivat") || lowerTitle.includes("inspir") ||
      lowerTitle.includes("passion")) {
    const interestStarters = [
      "I am particularly interested in",
      "What motivates me is",
      "I am inspired by",
      "My passion lies in",
      "What drives me is",
    ];
    const starter = interestStarters[Math.floor(Math.random() * interestStarters.length)];
    return `${starter} the opportunity to make a positive impact. ${faker.lorem.sentences({ min: 2, max: 3 })} This keeps me engaged and focused on continuous growth.`;
  }
  
  // Additional information questions
  if (lowerTitle.includes("additional") || lowerTitle.includes("anything else") || lowerTitle.includes("other")) {
    const additionalStarters = [
      "Additionally, I would like to mention",
      "One more thing to note is",
      "I would also like to add",
      "Furthermore,",
      "In addition to the above,",
    ];
    const starter = additionalStarters[Math.floor(Math.random() * additionalStarters.length)];
    return `${starter} ${faker.lorem.sentences({ min: 2, max: 3 })} Thank you for the opportunity to share my thoughts.`;
  }
  
  // Default contextual paragraph using the question topic
  const genericStarters = [
    "Regarding this topic,",
    "On this matter,",
    "With respect to this question,",
    "Considering this subject,",
    "In response to this,",
  ];
  const starter = genericStarters[Math.floor(Math.random() * genericStarters.length)];
  return `${starter} I would like to share my perspective. ${faker.lorem.sentences({ min: 2, max: 4 })} I hope this provides a helpful insight.`;
}

function generateUniformChoice(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

function generateSkewedChoice(options: string[], skewRight: boolean): string {
  // Use exponential weights to skew selection
  const weights = options.map((_, i) => {
    const position = skewRight ? i : options.length - 1 - i;
    return Math.pow(2, position);
  });
  return weightedChoice(options, weights);
}

function generateNormalChoice(options: string[]): string {
  // Generate a normally distributed index
  const mean = (options.length - 1) / 2;
  const std = options.length / 4;
  const index = Math.round(gaussian(mean, std));
  const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
  return options[clampedIndex];
}

// Maintain person data for consistent name/email generation
let personData: {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
} | null = null;

function generateAnswer(
  question: ParsedQuestion,
  distribution: QuestionDistribution | undefined,
  faker: Faker
): string | string[] {
  const distType = distribution?.distributionType || "uniform";

  switch (question.type) {
    case "multiple_choice":
    case "dropdown": {
      const options = question.options?.map((o) => o.value) || [];
      if (options.length === 0) return "";

      if (distType === "weighted" && distribution?.weights) {
        const values = distribution.weights.map((w) => w.value);
        const weights = distribution.weights.map((w) => w.weight);
        return weightedChoice(values, weights);
      }

      return applyDistribution(options, distType);
    }

    case "checkbox": {
      const options = question.options?.map((o) => o.value) || [];
      if (options.length === 0) return [];

      // Use validation-aware checkbox selection
      return generateValidatedCheckboxSelections(options, question.validation);
    }

    case "linear_scale": {
      const min = question.scale?.min ?? 1;
      const max = question.scale?.max ?? 5;
      const options = [];
      for (let i = min; i <= max; i++) {
        options.push(String(i));
      }

      if (distType === "weighted" && distribution?.weights) {
        const values = distribution.weights.map((w) => w.value);
        const weights = distribution.weights.map((w) => w.weight);
        return weightedChoice(values, weights);
      }

      return applyDistribution(options, distType);
    }

    case "short_text": {
      if (distribution?.templates && distribution.templates.length > 0) {
        return distribution.templates[
          Math.floor(Math.random() * distribution.templates.length)
        ];
      }
      
      // Check for validation-specific generation
      const validation = question.validation;
      
      // Handle email validation
      if (validation?.type === "email") {
        return faker.internet.email();
      }
      
      // Handle URL validation
      if (validation?.type === "url") {
        return faker.internet.url();
      }
      
      // Handle number validations
      if (validation && ["is_number", "whole_number", "greater_than", "greater_equal", 
          "less_than", "less_equal", "equal", "not_equal", "between", "not_between"].includes(validation.type)) {
        return String(generateValidatedNumber(validation, faker));
      }
      
      // Handle text length/content validations
      if (validation && ["length_max", "length_min", "length_equal", "contains", "not_contains", "regex"].includes(validation.type)) {
        // First generate heuristic-based text, then apply validation
        const title = question.title.toLowerCase();
        let baseText: string | undefined;
        
        // Initialize person data if needed
        if (!personData && (title.includes("name") || title.includes("email"))) {
          personData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            fullName: "",
            email: "",
          };
          personData.fullName = `${personData.firstName} ${personData.lastName}`;
          personData.email = faker.internet.email({
            firstName: personData.firstName,
            lastName: personData.lastName,
          });
        }
        
        if (title.includes("first name") && personData) baseText = personData.firstName;
        else if ((title.includes("last name") || title.includes("surname")) && personData) baseText = personData.lastName;
        else if (title.includes("name") && personData) baseText = personData.fullName;
        
        return generateValidatedText(validation, faker, baseText);
      }
      
      // Heuristic-based generation for common fields
      const title = question.title.toLowerCase();

      // Initialize person data if needed
      if (!personData && (title.includes("name") || title.includes("email"))) {
        personData = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          fullName: "",
          email: "",
        };
        personData.fullName = `${personData.firstName} ${personData.lastName}`;
        personData.email = faker.internet.email({
          firstName: personData.firstName,
          lastName: personData.lastName,
        });
      }

      // Helper to apply validation to heuristic-generated text
      const applyValidationIfNeeded = (text: string): string => {
        if (validation && ["length_min", "length_max", "length_equal"].includes(validation.type)) {
          return generateValidatedText(validation, faker, text);
        }
        return text;
      };

      if (title.includes("email") && personData) {
        return applyValidationIfNeeded(personData.email);
      }
      if (title.includes("first name") && personData) {
        return applyValidationIfNeeded(personData.firstName);
      }
      if (
        (title.includes("last name") || title.includes("surname")) &&
        personData
      ) {
        return applyValidationIfNeeded(personData.lastName);
      }
      if (title.includes("name") && personData) {
        return applyValidationIfNeeded(personData.fullName);
      }
      if (
        title.includes("phone") ||
        title.includes("mobile") ||
        title.includes("contact")
      ) {
        return applyValidationIfNeeded(faker.phone.number());
      }
      if (title.includes("age")) {
        // Use validation if present, otherwise default range
        return String(generateValidatedNumber(validation, faker, 18, 65));
      }
      if (title.includes("city") || title.includes("location")) {
        return applyValidationIfNeeded(faker.location.city());
      }
      if (title.includes("country")) {
        return applyValidationIfNeeded(faker.location.country());
      }
      if (title.includes("address") || title.includes("street")) {
        return applyValidationIfNeeded(faker.location.streetAddress());
      }
      if (
        title.includes("zip") ||
        title.includes("postal") ||
        title.includes("pincode")
      ) {
        return applyValidationIfNeeded(faker.location.zipCode());
      }
      if (title.includes("state") || title.includes("province")) {
        return applyValidationIfNeeded(faker.location.state());
      }
      if (title.includes("company") || title.includes("organization")) {
        return applyValidationIfNeeded(faker.company.name());
      }
      if (
        title.includes("job") ||
        title.includes("occupation") ||
        title.includes("profession") ||
        title.includes("designation")
      ) {
        return applyValidationIfNeeded(faker.person.jobTitle());
      }
      if (title.includes("website") || title.includes("url")) {
        return applyValidationIfNeeded(faker.internet.url());
      }
      if (title.includes("username")) {
        return applyValidationIfNeeded(faker.internet.username());
      }
      
      // Apply any remaining validation to generated text
      return generateValidatedText(validation, faker);
    }

    case "paragraph": {
      if (distribution?.templates && distribution.templates.length > 0) {
        return distribution.templates[
          Math.floor(Math.random() * distribution.templates.length)
        ];
      }
      
      // Generate contextual paragraph based on question title
      const contextualText = generateContextualParagraph(question.title, faker);
      
      // Handle validation for paragraph text (length constraints)
      const validation = question.validation;
      if (validation) {
        return generateValidatedText(validation, faker, contextualText);
      }
      
      return contextualText;
    }

    case "date": {
      const date = faker.date.recent({ days: 365 });
      return date.toISOString().split("T")[0];
    }

    case "time": {
      const hours = String(faker.number.int({ min: 0, max: 23 })).padStart(
        2,
        "0"
      );
      const minutes = String(faker.number.int({ min: 0, max: 59 })).padStart(
        2,
        "0"
      );
      return `${hours}:${minutes}`;
    }

    default:
      return "";
  }
}

function applyDistribution(
  options: string[],
  distType: DistributionType
): string {
  switch (distType) {
    case "uniform":
      return generateUniformChoice(options);
    case "normal":
      return generateNormalChoice(options);
    case "skewed_left":
      return generateSkewedChoice(options, false);
    case "skewed_right":
      return generateSkewedChoice(options, true);
    default:
      return generateUniformChoice(options);
  }
}

function buildPayload(
  questions: ParsedQuestion[],
  distributions: QuestionDistribution[],
  faker: Faker,
  pageHistory: number[],
  skipOptionalQuestions: boolean
): URLSearchParams {
  const params = new URLSearchParams();

  // Reset person data for each new response
  personData = null;

  for (const question of questions) {
    // Skip optional questions if the setting is enabled
    if (skipOptionalQuestions && !question.required) {
      continue;
    }

    const dist = distributions.find((d) => d.questionId === question.id);
    const answer = generateAnswer(question, dist, faker);

    if (Array.isArray(answer)) {
      for (const val of answer) {
        params.append(question.entryId, val);
      }
    } else if (answer) {
      params.append(question.entryId, answer);
    }
  }

  // Add pageHistory parameter for multi-page forms
  // This tells Google Forms that all pages have been visited
  if (pageHistory.length > 1) {
    params.append("pageHistory", pageHistory.join(","));
  }

  return params;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitRequestBody = await request.json();
    const {
      formId,
      questions,
      distributions,
      responseIndex,
      isPublishedForm,
      locale,
      pageHistory,
      skipOptionalQuestions,
    } = body;

    if (!formId || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Create Faker instance with the selected locale
    const faker = createFaker(locale || "en");

    // Determine submission URL based on form type
    const submitUrl = isPublishedForm
      ? `https://docs.google.com/forms/d/e/${formId}/formResponse`
      : `https://docs.google.com/forms/d/${formId}/formResponse`;

    const refererUrl = isPublishedForm
      ? `https://docs.google.com/forms/d/e/${formId}/viewform`
      : `https://docs.google.com/forms/d/${formId}/viewform`;

    const payload = buildPayload(questions, distributions || [], faker, pageHistory || [0], skipOptionalQuestions || false);

    const response = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: refererUrl,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });

    // Log response for debugging
    const responseText = await response.text();
    console.log("Response status:", response.status);
    if (!response.ok) {
      console.log("Response body (first 500 chars):", responseText.substring(0, 500));
    }

    // Consider submission successful if response is OK or a redirect
    const success = response.ok || response.status === 302;

    // Handle specific error for sign-in required
    if (response.status === 401) {
      return NextResponse.json({
        success: false,
        responseIndex,
        status: response.status,
        error:
          "Form requires sign-in. Please disable 'Require sign in' in Google Form settings.",
      });
    }

    return NextResponse.json({
      success,
      responseIndex,
      status: response.status,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit response", success: false },
      { status: 500 }
    );
  }
}