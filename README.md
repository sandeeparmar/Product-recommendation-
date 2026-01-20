# AI Product Recommendation Demo

A lightweight **React + Vite** demo app that showcases how AI-powered product recommendations can work in a simple frontend. Users can browse a product catalog and ask for recommendations based on budget, category, or use case—powered either by OpenAI or a local fallback logic.

---

## ✨ Features

* 📦 Simple, editable product catalog
* 🤖 AI-powered recommendations using OpenAI (optional)
* 🛠️ Local heuristic fallback (no API key required)
* ⚡ Fast setup with Vite
* 🔍 Clear UI showing recommendation source (AI or local)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16+ recommended)
* npm

### Run Locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually:
`http://localhost:5173`).

---

## 🤖 AI Setup (Optional)

The app works **out of the box** without any API key using a local recommendation heuristic.

To enable OpenAI-powered recommendations:

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Add your OpenAI API key in `.env`:

   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```

3. Restart the dev server:

   ```bash
   npm run dev
   ```

Once enabled, the UI will clearly indicate whether recommendations are coming from **OpenAI** or the **local** logic.

---

## 🧠 How It Works

* **`src/products.js`**
  Defines the product catalog displayed in the app.

* **`src/api/recommendations.js`**

  * Sends the product catalog and user input to OpenAI (if an API key is available).
  * Matches product names from the AI response back to the catalog.
  * Falls back to a simple budget/category-based heuristic if OpenAI is unavailable or fails.

* **`src/App.jsx`**

  * Renders the product list and recommendation form.
  * Displays recommended products along with the data source.

---

## 🔧 Customization

You can easily:

* Update or expand the product catalog
* Modify the AI system prompt
* Replace the local heuristic with another API or service
* Keep the same UI while swapping recommendation logic

---
