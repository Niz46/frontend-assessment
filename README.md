# 📦 Frontend Assessment — Crypto Checkout UI

A polished, responsive, production-ready frontend demonstrating a mini crypto checkout experience built with **Next.js 13+, TypeScript, and Tailwind CSS**. Focused on UI fidelity, accessibility, form state, component structure, and clean code.

This solution implements:

✅ Convert (crypto ↔ fiat)
✅ Recipient Details
✅ Send ETH confirmation

---

## 🧠 Table of Contents

1. **Project Overview**
2. **Features**
3. **Tech Stack**
4. **Screens**
5. **Getting Started**
   - Requirements
   - Setup
   - Running Locally

6. **Folder Structure (with examples)**
7. **Component Pattern**
8. **Design Principles**
9. **Future Enhancements**
10. **Contributing**
11. **License**

---

## 📌 1. Project Overview

This repository demonstrates the ability to translate high fidelity UI designs (Figma) into a responsive frontend using modern best practices. It includes interactive pages, reusable components, and thoughtful UX patterns.

The application simulates a crypto checkout flow without backend connectivity — all data is mocked or local.

---

## 💡 2. Features

- **Convert page**
  - Editable `You pay` / `You receive` amounts
  - Dynamic calculations based on mock rates
  - Dropdowns with icons & search
  - Reactive currency switching

- **Recipient Details**
  - Name, wallet address, network selection
  - Stylized inputs consistent with design spec

- **Send ETH**
  - Final confirmation UI
  - Fee breakdown
  - Total estimation block

- **Responsive & Accessible UI**
  - Tab navigation for conversion modes
  - Keyboard navigation in dropdowns
  - Input sanitation and formatting

---

## 🧰 3. Tech Stack

| Category             | Technology                      |
| -------------------- | ------------------------------- |
| Framework            | Next.js 13                      |
| Language             | TypeScript                      |
| Styles               | Tailwind CSS                    |
| Form Logic           | React State / Controlled Inputs |
| Components           | Reusable UI primitives          |
| Linting & Formatting | ESLint + Prettier               |
| Testing              | Vitest (configured)             |

---

## 📷 4. Screens

The project implements the following screens:

📌 **Convert Page**
A card featuring payment conversion with responsive dropdowns.

📌 **Recipient Details Page**
Form card to collect recipient information.

📌 **Send ETH Page**
Confirmation UI showing breakdown and total.

---

## 🚀 5. Getting Started

### 🛠 Requirements

Ensure you have:

- Node.js v18+
- npm (or yarn)
- Git

---

### 🔁 Clone

```bash
git clone https://github.com/Niz46/frontend-assessment.git
cd frontend-assessment
```

---

### 📦 Install Dependencies

```bash
npm install
```

or with Yarn:

```bash
yarn
```

---

### 🚀 Running the App Locally

```bash
npm run dev
```

Your site will be available at:

👉 [http://localhost:3000](http://localhost:3000)

---

### 🧪 Running Tests

```bash
npm test
```

---

## 📁 6. Folder Structure

```bash
frontend-assessment/
├── public/
│   └── assets/
│       ├── BTC.png
│       ├── ETH.png
│       └── …
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Input.tsx
│   │   └── payments/
│   │       ├── ConvertCard.tsx
│   │       ├── RecipientDetailsCard.tsx
│   │       └── SendEthCard.tsx
├── README.md
├── tailwind.config.js
├── next.config.js
├── package.json
└── …
```

---

## 🧩 7. Component Pattern

### 📌 Reusable UI Primitives

- **Card.tsx**
  - Provides structured UI zones with fixed width/height matching Figma
  - Reused for all primary screens

- **Dropdown.tsx**
  - Flexible: supports `compact`, `center` and `right` popovers
  - Searchable, keyboard accessible, and customizable colors/width

- **Button.tsx**
  - Standardized styling, consistent CTA behavior

- **Input.tsx**
  - Accessible form field
  - Used for text and numeric inputs

---

## 🎨 8. Design Principles

The UI adheres to:

✅ Consistent spacing using Tailwind utility classes
✅ Fixed pixel sizes from Figma for cards and inputs
✅ Accessibility (aria, keyboard navigation)
✅ Semantic HTML
✅ Clean developer experience (clear components)

Example:

| Element         | Sizes from Figma |
| --------------- | ---------------- |
| Card            | 640 × 758        |
| Navbar          | 392 × 34         |
| Input blocks    | 512 width        |
| Rounded corners | 30px             |

---

## 🚧 9. Future Enhancements

Here are possible improvements once backend or APIs are connected:

### 🟡 UX Enhancements

- Loading states / spinners
- Error & validation messaging
- Form validation with zod / react-hook-form

### 🟡 Feature Extensions

- Connect exchange API for real rates
- Wallet integration (Metamask)
- Transaction confirmation screens

### 🟡 Testing

- Add UI tests with Testing Library
- Snapshot tests
- Dropdown keyboard behavior coverage

---

## 🤝 10. Contributing

Contributions are welcome! Follow this flow:

1. **Fork repo**
2. Create feature branch
   `git checkout -b feat/your-feature`
3. Add your changes
4. Open PR with description

---

## 📜 11. License

This project is open sourced for assessment purposes.

---

## ❤️ Final Notes

This repository demonstrates not only functional UI, but also **attention to detail, accessibility, and scalability** — key qualities in professional frontend engineering.
