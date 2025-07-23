# 📅 SchedSim – OS Scheduling Algorithms Visualizer

**SchedSim** is a comprehensive web application built with **Next.js, React, and TypeScript** for visualizing and understanding various **CPU scheduling algorithms** used in operating systems.

## 🚀 Features

### 🧠 Supported Scheduling Algorithms
- **First Come First Serve (FCFS)** – Non-preemptive
- **Shortest Job First (SJF)** – Non-preemptive
- **Shortest Remaining Time First (SRTF)** – Preemptive
- **Round Robin (RR)** – Time-sliced execution with configurable quantum
- **Priority Scheduling** – Both preemptive and non-preemptive
- **Priority Override Mode** – Apply priority-based scheduling to any algorithm

### 🕹️ Interactive Features
- 📊 **Gantt Chart Visualization** with animated, step-by-step simulation
- 📈 **Performance Metrics** – Avg. waiting, turnaround, response time, CPU utilization
- 🎮 **Dynamic Process Management** – Add, edit, and remove processes on the fly
- 🎯 **Priority Configuration** – Choose between higher-first/lower-first modes
- ⚙️ **Algorithm Customization** – Configure time quantum for RR
- 📱 **Responsive Design** – Seamless across desktop, tablet, and mobile
- 🌙 **Theme Toggle** – Light & dark mode support

### 📺 Visualization Tools
- 🎞️ Step-by-step simulator with playback controls & speed adjustment
- 🧾 Results Table with all calculated metrics
- 🔎 Process Legend with color-coded tags
- 🕒 Execution Timeline breakdown

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **UI Library**: shadcn/ui
- **Icons**: Lucide React
- **Theming**: next-themes

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/schedsim.git
cd schedsim

# Install dependencies
npm install   # or yarn / pnpm install

# Start the development server
npm run dev   # or yarn dev / pnpm dev
```

Open your browser and navigate to **http://localhost:3000**

---

## 🎯 Usage Guide

### ➕ Adding Processes
1. Click **"Add Process"** in the queue section
2. Enter:
   - `Process Name` (e.g., P1, P2)
   - `Arrival Time`
   - `Burst Time`
   - `Priority` (if enabled)

### 🧪 Configuring Algorithms
- Choose from dropdown: FCFS, SJF, SRTF, RR, Priority
- Enable **Priority Mode** if needed
- Set **Priority Order** (higher-first or lower-first)
- Configure **Time Quantum** for RR

### ▶️ Running Simulations
- Add at least one process
- Select your algorithm and configuration
- Click **"Run Scheduling"**
- Results will display in the **Gantt Chart** and **Results Table**

### 🧩 Simulator Mode
- Click **"Simulate"** on the chart
- Use controls to play/pause/step
- Adjust speed as needed

---

## 📊 Understanding the Results

| Metric | Description |
|--------|-------------|
| 🕰️ Average Waiting Time | Time spent in ready queue |
| 🔁 Turnaround Time | Time from arrival to completion |
| ⏱️ Response Time | Time to first CPU allocation |
| 💻 CPU Utilization | % of time CPU is actively running |

---

## 🔍 Algorithm Overview

| Algorithm | Type | Highlights | Caveats |
|----------|------|------------|---------|
| FCFS | Non-preemptive | Simple & fair | May cause convoy effect |
| SJF | Non-preemptive | Optimal waiting time | Starvation possible |
| SRTF | Preemptive | Better response time | More context switching |
| RR | Preemptive | Good for time-sharing | Depends on time quantum |
| Priority | Both | Handles critical tasks | Starvation risk |

---

## 🎨 Customization

- Toggle **light/dark themes** via the button in top-right
- Colors assigned from predefined palette: Blue, Green, Yellow, Purple, Pink, Indigo, Red, Teal
- Fully **responsive design**:
  - Mobile: `<768px`
  - Tablet: `768–1024px`
  - Desktop: `>1024px`

---

## 🤝 Contributing

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push and open PR
git push origin feature/amazing-feature
```
