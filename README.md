# Public APIs Explorer

**Live Demo:** [https://public-apis-explorer-xi.vercel.app/](https://public-apis-explorer-xi.vercel.app/)

The definitive directory to find, explore, and integrate the best public APIs into your next project. We've indexed and verified over 1,742 public APIs across dozens of categories with zero friction, instant search, and unified specifications.

## 🚀 Features

- **1,742+ Indexed APIs**: A massive collection of verified public APIs.
- **Bilingual Support (EN/FR)**: Fully localized interface and AI-translated API descriptions.
- **Instant Search & Filtering**: Lightning-fast search with filtering by Category, Auth type, HTTPS, and CORS support.
- **Integration Snippets**: Ready-to-use code snippets (cURL, JavaScript, Python, Node.js, Go) for every API.
- **Favorites System**: Bookmark your favorite APIs locally.
- **Dark Mode Support**: Beautiful UI adapting to your system preferences.
- **Fully Responsive**: Designed to work perfectly on desktop, tablet, and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Enrichment**: Built-in scripts using `gpt-4o-mini` to automatically clean, detail, and translate API entries.
- **Deployment**: [Vercel](https://vercel.com/) with Web Analytics

## 📦 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/Amine-NAHLI/public-apis-explorer.git
cd public-apis-explorer/web
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤖 Data Enrichment Scripts

This project includes Node.js scripts to fetch, clean, and enrich API data using OpenAI's GPT models.

1. **Extract APIs**: Fetches the latest APIs from external sources.
   ```bash
   node scripts/extract-apis.js
   ```
2. **Enrich Descriptions**: Uses AI to generate structured, professional descriptions for each API.
   ```bash
   node scripts/enrich-apis.mjs
   ```
3. **Translate APIs**: Uses AI to translate all API descriptions into French for bilingual support.
   ```bash
   node scripts/translate-apis.mjs
   ```

## 🤝 Contributing

Missing an API? Want to improve the platform? Contributions are welcome!
Feel free to open an issue or contact the developer.

- **Developer**: Amine NAHLI
- **LinkedIn**: [Amine NAHLI](https://www.linkedin.com/in/amine-nahli-48b2a734b/)
- **Email**: nahli-ami@upf.ac.ma

## 📄 License

This project is open-source and free to use.
