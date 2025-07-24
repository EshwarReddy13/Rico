# Rico 💎

**A rich, collaborative text editor for the modern web.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Frico&env=FIREBASE_PROJECT_ID,FIREBASE_CLIENT_EMAIL,FIREBASE_PRIVATE_KEY,DATABASE_URL&project-name=rico&repository-name=rico)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Rico is an open-source initiative to build a world-class, real-time collaborative document editor. It is architected as both a beautiful standalone web application and a powerful embeddable component for developers, built on a modern, scalable tech stack.

### Official Website Link Coming Soon!!!!!!

---

## About The Project

In an era where collaboration is key, standard text editors feel isolated. Rico is designed to change that. Our mission is to build a "Google Docs-like" experience that is not only a joy to use but is also accessible for any developer to integrate into their own application.

This repository contains the entire Rico ecosystem, managed as a high-performance monorepo. It includes the standalone web app and the packages that power the embeddable component.

## ✨ Core Features

### Editing Experience
*   🎨 **Pixel-Perfect Custom UI:** A beautiful and intuitive interface built from scratch with React and Tailwind CSS.
*   🔄 **Dual-Mode Editing:** Seamlessly switch between a continuous **Linear (document)** mode and a structured **Block (Notion-style)** mode.
*   🤖 **Integrated AI Assistant:** Use slash commands or text selection to improve writing, summarize, translate, and more.
*   ⚡ **Smart Slash Commands:** Type `/` to instantly insert tables, images, code blocks, and templates.
*   ✅ **Interactive Checklists:** Create to-do lists and `@mention` users to assign tasks.
*   📝 **Advanced Content:** Code blocks with syntax highlighting, rich media embeds (YouTube, Figma), and more.

### Collaboration & Productivity
*   🤝 **Seamless Real-Time Collaboration:** Powered by Y.js for conflict-free, simultaneous editing.
*   👀 **Live User Presence:** See who's online with live cursors, selection highlighting, and a row of user avatars.
*   💬 **Inline Commenting:** Attach discussion threads to any piece of text.
*   ⏳ **Comprehensive Version History:** View and restore previous snapshots of the document.
*   ക്ഷണ **App-Controlled Invitations:** A flexible system where the host app manages sharing and permissions.

### Platform & Technology
*   🚀 **Standalone Web Application:** A full-featured app at `rico.app` with user auth, dashboards, and document management.
*   🧩 **Embeddable Component for Devs:** The core editor packaged as a professional npm module for any developer to use.
*   ⚡ **Instantaneous Performance:** A "stale-while-revalidate" caching strategy for lightning-fast document loads.
*   📄 **Versatile Import/Export:** Handle `.docx`, `.md` files, and provide a beautiful, clean "Export to PDF" function.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | Core application structure, routing, and API layer. |
| **Styling** | **Tailwind CSS & Shadcn/UI** | Building a fast, custom, and responsive design system. |
| **Language** | **TypeScript** | Enforcing type safety across the entire codebase. |
| **Real-Time Collab** | **Firebase Realtime Database** | High-speed message bus for Y.js synchronization. |
| **Authentication** | **Firebase Authentication** | Secure user identity management. |
| **File Storage** | **Firebase Storage** | Storing imported source files like `.docx`. |
| **Primary Database** | **Neon (PostgreSQL)** | Storing all relational data (users, docs, permissions). |
| **API & DB Access** | **Next.js API Routes + Prisma** | Creating a secure, type-safe API to talk to our DB. |
| **Monorepo** | **Turborepo** | High-performance build system for the codebase. |

## 🗺️ Roadmap

Rico is being built with a clear, phased strategy.

*   [ ] **Phase 1: Build the Standalone Application (`rico.app`)**
    *   Implement user authentication, dashboard, and document management.
    *   Build the core editor with all real-time and UI features.
    *   Launch the web app and gather user feedback.

*   [ ] **Phase 2: Productize the Embeddable Component (`@rico/editor`)**
    *   Refactor the core editor into a reusable npm package.
    *   Develop the flexible props and callbacks API (`onInvite`, etc.).
    *   Build the secure authentication gateway for third-party developers.
    *   Launch the developer platform with world-class documentation.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
_Built with absolute boredom by [Eshwar](https://github.com/EshwarReddy13)._

