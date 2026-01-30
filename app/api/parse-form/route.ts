import { NextRequest, NextResponse } from "next/server";
import { parseFormData, extractFormId } from "@/app/lib/form-parser";

// Resolve shortened Google Forms URLs
async function resolveShortUrl(url: string): Promise<string> {
  if (url.includes("forms.gle")) {
    try {
      // Try HEAD request first
      const response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      return response.url;
    } catch {
      // Fallback to GET request if HEAD fails
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      return response.url;
    }
  }
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const { url: inputUrl } = await request.json();

    if (!inputUrl || typeof inputUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid Google Form URL" },
        { status: 400 }
      );
    }

    // Resolve shortened Google Forms URLs
    let url = inputUrl.trim();
    if (url.includes("forms.gle")) {
      try {
        url = await resolveShortUrl(url);
      } catch {
        return NextResponse.json(
          {
            error:
              "Could not resolve shortened URL. Please try using the full Google Forms URL.",
          },
          { status: 400 }
        );
      }
    }

    // Validate Google Forms URL
    if (!url.includes("google.com/forms")) {
      return NextResponse.json(
        { error: "Please enter a valid Google Forms URL" },
        { status: 400 }
      );
    }

    // Extract form ID
    const formId = extractFormId(url);
    if (!formId) {
      return NextResponse.json(
        {
          error:
            "Could not extract form ID from URL. Please check the URL format.",
        },
        { status: 400 }
      );
    }

    // Determine if it's a published form
    const isPublishedForm = url.includes("/forms/d/e/");

    // Build the correct form URL
    const formUrl = isPublishedForm
      ? `https://docs.google.com/forms/d/e/${formId}/viewform`
      : `https://docs.google.com/forms/d/${formId}/viewform`;

    console.log("Fetching form:", formUrl);

    // Fetch the form HTML
    const response = await fetch(formUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch form. Status: ${response.status}. Make sure the form is public.`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Check if the form requires sign-in
    const requiresSignIn =
      html.includes("accounts.google.com") ||
      html.includes("signin") ||
      html.includes("Sign in") ||
      (html.includes("freebirdFormviewerViewFormContentWrapper") === false &&
        html.includes("login"));

    // Extract the FB_PUBLIC_LOAD_DATA_ variable
    const fbDataMatch = html.match(
      /FB_PUBLIC_LOAD_DATA_\s*=\s*([\s\S]*?);\s*<\/script>/
    );

    // Extract fbzx token if present
    let fbzx: string | undefined;
    const fbzxMatch = html.match(/name="fbzx"\s+value="([^"]+)"/)
      || html.match(/"fbzx":"([^"]+)"/)
      || html.match(/fbzx=(-?[\d]+)/);
    if (fbzxMatch) {
      fbzx = fbzxMatch[1];
    }
    
    console.log("Extracted fbzx:", fbzx);

    if (!fbDataMatch) {
      // Check for sign-in requirement
      if (html.includes("accounts.google.com") || html.includes("Sign in")) {
        return NextResponse.json(
          {
            error:
              "This form requires sign-in. Please disable 'Require sign in' in your Google Form settings to use this tool.",
            requiresSignIn: true,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Could not find form data. The form might require sign-in or be private.",
        },
        { status: 400 }
      );
    }

    // Parse the FB_PUBLIC_LOAD_DATA_ JSON
    let fbData: unknown[];
    try {
      fbData = JSON.parse(fbDataMatch[1]);
    } catch {
      return NextResponse.json(
        {
          error:
            "Failed to parse form data. The form structure might be unsupported.",
        },
        { status: 400 }
      );
    }

    // Parse form data into structured format
    const parsedForm = parseFormData(fbData);

    if (!parsedForm) {
      return NextResponse.json(
        {
          error:
            "Failed to extract questions from form. Please try a different form.",
        },
        { status: 400 }
      );
    }

    // Set additional form properties
    parsedForm.formId = formId;
    parsedForm.isPublishedForm = isPublishedForm;
    parsedForm.fbzx = fbzx;

    if (parsedForm.questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "No supported questions found in the form. File upload questions are not supported.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ form: parsedForm });
  } catch (error) {
    console.error("Form parsing error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while parsing the form." },
      { status: 500 }
    );
  }
}