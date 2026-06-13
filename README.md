# Cube Goat 🧊

Computer Vision & Logic Engine for optimal Rubik's Cube solutions.

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?logo=opencv)](https://opencv.org/)

## Overview
Cube Goat provides an efficient, user-friendly interface to calculate optimal solutions for standard 3x3 Rubik's Cubes. By leveraging the **Kociemba Algorithm** and computer vision, users can either map their cube state manually or upload an image to have the software detect the state automatically.

## Visuals

### Full Interface
![Main UI](assets/Screenshot%20from%202026-06-14%2003-11-11.png)

### Manual State Mapping
![Manual Grid](assets/image_b4a67d.png)

## Features
*   **Optimal Solver**: Uses the Two-Phase Algorithm to guarantee solutions under 20 moves.
*   **Dual-Input Modes**: Switch between Manual Input and Image Upload (Computer Vision).
*   **Responsive UI**: Sleek, minimalist design built with Tailwind CSS.
*   **Theme Support**: Fully functional Light and Dark mode with haptic/audio feedback.

## Tech Stack
*   **Frontend**: Next.js 15, Tailwind CSS, Lucide React
*   **Backend**: FastAPI (Python)
*   **Core Logic**: Kociemba Algorithm
*   **Computer Vision**: OpenCV

## Installation

1. Clone the repository:
```bash
   git clone [https://github.com/shai-tan1/CubeGoat.git](https://github.com/shai-tan1/CubeGoat.git)
   cd CubeGoat
```
2. Install dependencies:

```bash
   npm install
```
3. Run the development server:

```bash
   npm run dev
```
Author
~/shaun

GitHub | LinkedIn | Email

The luck of having talent is not enough; one must also have a talent for luck. — Hector Berlioz