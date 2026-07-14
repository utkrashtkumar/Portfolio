<div align="center">
 

  # 🛡️ Utkrasht Kumar // Cyber Security Portfolio
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-yellow.svg?logo=vite)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth-green.svg?logo=supabase)](https://supabase.com/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

  **Interactive Cybersecurity Portfolio & Offensive Security Labs Dashboard**
</div>

---

## 📌 Project Overview
This repository hosts the source code for the professional portfolio website of **Utkrasht Kumar**, a Cybersecurity Analyst, Penetration Tester, and Security Researcher. 

Unlike static portfolios, this site is built as an interactive, fully client-side terminal environment and security lab sandbox, allowing visitors to engage with cryptographic algorithms, run simulated vulnerability tests, crack hashes, and check their device fingerprints.

---

## ⚙️ Interactive Labs & Security Modules
The application includes a comprehensive suite of security labs running 100% locally in the browser:

1. **System Fingerprint Profiler**: Passive reconnaissance module retrieving client GPU, canvas headers, screens, and network configurations.
2. **Live Hash Cracker**: Cryptographic verification testing pipeline supporting brute-force/dictionary match checks for SHA-256 and SHA-1 hashes.
3. **Cipher Playground**: Transform text inputs via ROT13, Caesar shifts, Vigenère tables, and Base64 translations in real time.
4. **XSS Sandbox Lab**: Illustrates how Cross-Site Scripting payloads bypass Web Application Firewall (WAF) filters.
5. **OSINT Recon Simulator**: Simulates network sweeps, DNS resolutions, subdomain discovery, and email exposure scanning on domain nodes.
6. **Incident Response Simulator**: Simulated blue-team triage response room scoring decision speeds during threat feeds alerts.
7. **Cyber Kill Chain Visualizer**: Mapped Lockheed Martin kill chain timelines.
8. **CTF Intrusion Challenges**: Complete local Capture The Flag arena including solver ledgers.
9. **AI Chatbot Overlay ("HackerBot")**: Sits inline to answer recruiters' questions about Utkrasht's qualifications.
10. **Terminal Overlay console**: Global keyboard listener overlay (``Ctrl + ` ``) enabling quick shortcut commands.
11. **Supabase Secure Authentication Portal**: Secure User registration/login portal tracking solver session logs.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) (installed automatically with Node.js)

### Installation
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/utkrashtkumar/portfolio.git
   cd portfolio
   ```

2. Install all required packages:
   ```bash
   npm install
   ```

3. Configure your Environment Variables (Optional):
   Rename `.env.example` to `.env` and fill in your Supabase details:
   ```env
   VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
   VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
   ```
   *Note: If environment variables are missing, the UI provides a settings modal to configure Supabase directly at runtime!*

4. Spin up the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Built With
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚖️ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
