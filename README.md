# ⚡ Cálculo Rápido (Speed Math)

> An interactive, modern web application designed to boost mental math agility, speed, and accuracy.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Online-success?style=for-the-badge&logo=githubpages&logoColor=white)](https://jd164.github.io/calculo-rapido/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🎯 About The Project

**Cálculo Rápido** is a web-based mental math training tool built for students, enthusiasts, and anyone looking to sharpen their arithmetic skills and mental agility. 

Featuring a clean, intuitive, and responsive user interface, the app allows users to customize their workout sessions across various arithmetic operations, difficulty levels, and response formats, complete with in-depth statistical tracking to monitor progress over time.

👉 **Play the live game at:** [https://jd164.github.io/calculo-rapido/](https://jd164.github.io/calculo-rapido/)

---

## ✨ Key Features

- ➕ **Comprehensive Arithmetic Operations:**
  - Addition (`+`)
  - Subtraction (`-`)
  - Multiplication (`×`)
  - Division (`÷`)
  - Dedicated **Times Tables** practice (customizable from 2 to 12)
  - **Mixed Mode** (dynamic mix of all operations)

- 🎚️ **Multiple Difficulty Levels:**
  - **Easy:** Straightforward calculations with smaller numbers — perfect for beginners and warm-ups.
  - **Medium:** Balanced challenges designed to push calculation speed.
  - **Hard:** Larger operands and multi-step mental arithmetic under pressure.

- ⌨️ **Flexible Input Methods:**
  - **Manual Input / Typing:** Simulates realistic calculations and numpad agility.
  - **Multiple Choice:** Fast-paced option selection to test quick reflexes and estimation.

- ⏱️ **Training Modes:**
  - Fixed-length sessions: **10**, **20**, or **50** questions.
  - **Free / Unlimited Mode** for continuous practice without time or question caps.

- 📊 **Detailed Analytics & History:**
  - Session accuracy rate (% correct).
  - Average response time per operation.
  - Visual charts showing performance trends and speed development over time.
  - Persistent local session storage via browser `localStorage`.

- 🔊 **Sound & Instant Visual Feedback:**
  - Dynamic audio cues for correct and incorrect answers (with mute toggle).
  - Smooth animations and immediate visual confirmation.

---

## 🛠️ Built With

- **[React 18](https://react.dev/)** — Declarative UI library for component-based reactive state management.
- **[Vite](https://vitejs.dev/)** — Next-generation frontend tooling and ultra-fast development server.
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework for modern, responsive styling.
- **[Lucide React](https://lucide.dev/)** — Clean, consistent icons throughout the UI.
- **HTML5 Web Storage API** — Client-side persistent data storage without requiring an external backend.

---

## 📂 Project Structure

```plaintext
calculo-rapido/
├── .github/              # GitHub Actions workflows and configuration
├── public/               # Public static assets
├── src/
│   ├── components/       # Modular UI components
│   │   ├── Charts.jsx    # Performance charts and progress visualization
│   │   ├── Game.jsx      # Active game screen and question handler
│   │   ├── Header.jsx    # App header, sound toggle, and navigation
│   │   ├── Menu.jsx      # Configuration menu and game mode selector
│   │   ├── Results.jsx   # Post-session summary and score breakdown
│   │   └── Stats.jsx     # Comprehensive statistics and history dashboard
│   ├── utils/            # Helper utilities, audio synthesizer, and localStorage management
│   ├── App.jsx           # Root application component and routing state
│   ├── index.css         # Global stylesheet and Tailwind directives
│   └── main.jsx          # Application entry point
├── abrir.bat             # One-click launch script for Windows environments
├── index.html            # HTML entry point
├── package.json          # Project metadata, dependencies, and scripts
├── tailwind.config.js    # Tailwind theme customizations
└── vite.config.js        # Vite configuration and build options
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- Package manager: [npm](https://www.npmjs.com/) (bundled with Node.js), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jd164/calculo-rapido.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd calculo-rapido
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   - Visit `http://localhost:5173/` (or the URL output in your terminal).

> 💡 **Windows Tip:** You can also simply double-click the `abrir.bat` file to install/launch the project automatically.

---

## 📦 Available Scripts

In the project root, you can execute:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and minifies the app for production in the `dist/` folder. |
| `npm run preview` | Locally previews the production build. |

---

## 🌐 Deployment to GitHub Pages

This project is set up for continuous deployment using **GitHub Pages**:

1. Any changes pushed to the `main` branch trigger an automated build workflow.
2. The production bundle is deployed and accessible at:
   ```
   https://jd164.github.io/calculo-rapido/
   ```

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are always welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a **Pull Request**.

---

## 📄 License

This project is open-source and intended for educational and self-improvement purposes. Check with the author for specific licensing terms.

---

<div align="center">
  Crafted with ⚡ by <a href="https://github.com/jd164">jd164</a>
</div>
