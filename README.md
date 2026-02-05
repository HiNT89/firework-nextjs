# 🎆 Firework Next.js

A beautiful interactive fireworks simulation built with Next.js, React 19, and Canvas API.

## ✨ Features

- 🎨 Multiple firework shell types (Crysanthemum, Heart, Ring, Palm, etc.)
- 🎛️ Customizable settings (quality, size, sky lighting, scale)
- 🔊 Sound effects
- 📱 Responsive design
- ⌨️ Keyboard shortcuts (P: Pause, O: Menu, Esc: Close menu)

## 🐳 Run with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd firework-nextjs

# Build and run with Docker Compose
docker-compose up frontend-firework --build -d

# Or build and run manually
docker build -t firework-nextjs .
docker run -p 3005:3000 firework-nextjs
```

### Access the Application

Open your browser and navigate to: **http://localhost:3007**

### Docker Commands

```bash
# Start the container
docker-compose up -d

# Stop the container
docker-compose down

# Rebuild and start (after code changes)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

## 💻 Local Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **State Management:** Zustand
- **Styling:** Tailwind CSS, Sass
- **UI Components:** Ant Design
- **Icons:** Font Awesome

## 📁 Project Structure

```
firework-nextjs/
├── app/                    # Next.js app directory
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   ├── components/         # React components
│   ├── config/             # Configuration constants
│   ├── core/               # Core engine (particles, sound)
│   ├── helper/             # Shell definitions
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 📜 License

MIT License
