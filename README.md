
# Algorithm Visualizer

An interactive web application for visualizing the step-by-step execution of fundamental Data Structures and Algorithms. The project helps users understand how algorithms work internally through animations, execution states, and detailed explanations.

## Features

- Interactive algorithm visualizations
- Step-by-step execution controls
- Custom user input support
- Time and space complexity analysis
- Algorithm-specific explanations
- Responsive and clean user interface

## Implemented Algorithms

- Binary Search
- Rotated Sorted Array Search
- Dutch National Flag Algorithm

## Tech Stack

- React
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- HTML5
- CSS3

## Project Structure

```
src/
├── algorithms/
├── components/
│   ├── visualizers/
│   ├── ExplanationPanel.jsx
│   ├── InputPanel.jsx
│   └── StepControls.jsx
├── App.jsx
└── main.jsx
```

## How It Works

Each algorithm generates a sequence of execution steps instead of directly updating the user interface. Every step stores the current state of the algorithm, including array values, active indices or pointers, highlighted elements, and a textual explanation. The visualization engine renders these steps, allowing users to move forward and backward through the algorithm execution interactively.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/aditya160206/algorithm-visualizer.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Live Demo

https://algovisualizer33.vercel.app/

## Future Improvements

- Merge Intervals Visualization
- Set Matrix Zeroes
- Spiral Matrix
- Merge Sort
- Breadth First Search (BFS)
- Depth First Search (DFS)
- Dijkstra's Algorithm
- Bellman-Ford Algorithm
- Variable State Panel
- Source Code Display
- Animation Speed Controls
- Dark/Light Theme

## License

This project is intended for educational purposes.
