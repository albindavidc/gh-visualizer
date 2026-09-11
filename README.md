# 📊 Stats Visualizer

A beautiful, full-stack web application to visualize, customize, and gamify your developer statistics across GitHub and LeetCode. 

Whether you want to show off your longest coding streaks, visualize your problem-solving progress, or blast your contribution history in an interactive space shooter, Stats Visualizer makes your data look incredible.

<div align="center">
  <img src="public/favicon.svg" alt="Stats Visualizer" width="120" />
</div>

## ✨ Features

- 🐙 **GitHub Contributions**: View your yearly heatmap, longest streaks, and top programming languages in a sleek, modern layout.
- 👾 **Space Shooter Mode**: Turn your GitHub contribution graph into a playable HTML5 retro arcade space shooter!
- 💻 **LeetCode Metrics**: Showcase your problem-solving progress with beautiful completion rings, difficulty breakdowns, and a 52-week activity heatmap.
- 🎨 **Premium Themes**: Choose from multiple built-in color schemes including Sleek, Dracula, Ocean, Amber, and Classic GitHub.
- ✍️ **Typography Controls**: Customize the visualizer with an array of beautiful Google Fonts (e.g., Patrick Hand, Source Code Pro, Baloo 2).
- ⚙️ **Flexible UI Toggles**: Effortlessly hide borders or languages to craft the perfect minimalist embed.
- 🔗 **Markdown Embeds**: Generate dynamic URL links and Markdown snippets directly from the UI to paste into your personal README or portfolio.
- ⚡ **Full-Stack Architecture**: Powered by React, Vite, Tailwind CSS on the frontend, and a Node.js/Express backend that securely proxies API requests.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express (API Proxy for secure GitHub and LeetCode data fetching)
- **Deployment**: Configured for rapid cloud-native deployment with optimized static bundling via ESBuild.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token (for the backend API to fetch GitHub stats without strict rate limits)

### Setup

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add your GitHub token:
   ```env
   GH_TOKEN=your_github_personal_access_token
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm run start
```
This will compile the frontend via Vite, bundle the Express server using ESBuild, and serve the highly optimized full-stack application.

## 🎮 How to Use

1. Enter your **GitHub** or **LeetCode** username in the search bar.
2. Select your desired platform.
3. Toggle between **Classic View** and **Arcade Shooter Mode** (GitHub only).
4. Customize the **Theme**, **Font**, and layout toggles.
5. Click **Copy Embed** to grab a Markdown snippet for your profile!

## 📜 License

MIT
