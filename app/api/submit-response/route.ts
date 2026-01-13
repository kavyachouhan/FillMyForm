import { NextRequest, NextResponse } from "next/server";
import { Faker, allLocales, base, en } from "@faker-js/faker";
import {
  ParsedQuestion,
  QuestionDistribution,
  DistributionType,
  FakerLocale,
} from "@/app/lib/types";

interface SubmitRequestBody {
  formId: string;
  questions: ParsedQuestion[];
  distributions: QuestionDistribution[];
  responseIndex: number;
  isPublishedForm: boolean;
  locale: FakerLocale;
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

      // For checkboxes, select multiple options
      const count = Math.floor(Math.random() * Math.min(3, options.length)) + 1;
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
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

      if (title.includes("email") && personData) return personData.email;
      if (title.includes("first name") && personData)
        return personData.firstName;
      if (
        (title.includes("last name") || title.includes("surname")) &&
        personData
      )
        return personData.lastName;
      if (title.includes("name") && personData) return personData.fullName;
      if (
        title.includes("phone") ||
        title.includes("mobile") ||
        title.includes("contact")
      )
        return faker.phone.number();
      if (title.includes("age"))
        return String(faker.number.int({ min: 18, max: 65 }));
      if (title.includes("city") || title.includes("location"))
        return faker.location.city();
      if (title.includes("country")) return faker.location.country();
      if (title.includes("address") || title.includes("street"))
        return faker.location.streetAddress();
      if (
        title.includes("zip") ||
        title.includes("postal") ||
        title.includes("pincode")
      )
        return faker.location.zipCode();
      if (title.includes("state") || title.includes("province"))
        return faker.location.state();
      if (title.includes("company") || title.includes("organization"))
        return faker.company.name();
      if (
        title.includes("job") ||
        title.includes("occupation") ||
        title.includes("profession") ||
        title.includes("designation")
      )
        return faker.person.jobTitle();
      if (title.includes("website") || title.includes("url"))
        return faker.internet.url();
      if (title.includes("username")) return faker.internet.username();
      return faker.lorem.words({ min: 2, max: 5 });
    }

    case "paragraph": {
      if (distribution?.templates && distribution.templates.length > 0) {
        return distribution.templates[
          Math.floor(Math.random() * distribution.templates.length)
        ];
      }
      return faker.lorem.paragraph({ min: 1, max: 3 });
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
  faker: Faker
): URLSearchParams {
  const params = new URLSearchParams();

  // Reset person data for each new response
  personData = null;

  for (const question of questions) {
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

    const payload = buildPayload(questions, distributions || [], faker);

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