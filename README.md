# FillMyForm

Generate realistic test responses for Google Forms quickly and easily.

**Website:** [https://www.fillmyform.xyz](https://www.fillmyform.xyz)

## Features

- **Realistic Data Generation** - Create authentic-looking responses with names, emails, demographics using region-specific data powered by Faker.js
- **Custom Distributions** - Control response patterns with flexible distributions (random, balanced, or skewed)
- **Bulk Generation** - Generate up to 100 responses instantly
- **Smart Question Support** - Handles multiple choice, checkboxes, dropdowns, linear scales, text fields, grids, dates, times, and more
- **Multi-language Support** - Generate data in 18+ locales including English, German, French, Spanish, Japanese, Chinese, and more
- **Instant Submission** - Responses are submitted directly to your Google Form

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kavyachouhan/fillmyform.git
cd fillmyform

# Install dependencies
pnpm install

# Run the development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file in the root directory and copy the contents of `.env.example`. Fill in the required Appwrite configuration values.
```

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Data Generation:** [Faker.js](https://fakerjs.dev)
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics
- **Backend:** Appwrite

## Project Structure

```
app/
├── api/
│   ├── log-form/        # Form logging endpoint
│   ├── parse-form/      # Google Form parser
│   └── submit-response/ # Response submission
├── components/          # Landing page components
├── fill/
│   ├── configure/       # Configure response settings
│   ├── progress/        # Submission progress view
│   └── result/          # Results summary
├── lib/
│   ├── form-context.tsx # React context for form state
│   ├── form-parser.ts   # Google Form parsing logic
│   └── types.ts         # TypeScript definitions
├── privacy/             # Privacy policy page
└── terms/               # Terms of service page
```

## Use Cases

- **Test Analytics** - Validate dashboards and data visualization tools
- **Verify Logic** - Test form branching and conditional questions
- **Research Data** - Create pilot datasets for academic projects
- **QA Testing** - Generate test data for form validation

## Disclaimer

FillMyForm is intended for academic and testing purposes only. We do not promote or condone fraudulent activity. Users are solely responsible for ensuring their use complies with applicable policies and regulations.

## License
This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kavyachouhan/fillmyform/issues).

---

Made with ❤️ for researchers, students, and data analysts