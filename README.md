# 🧊 Cube Goat 

**[🚀 Live Demo: cube-goat.vercel.app](https://cube-goat.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-005571?style=for-the-badge&logo=fastapi)
![OpenCV](https://img.shields.io/badge/OpenCV-4.x-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Cube Goat** is a full-stack, AI-driven web application that calculates optimal solutions for standard 3x3 Rubik's Cubes. It features a fully interactive 3D WebGL interface, an OpenCV-powered computer vision engine for automated state extraction, and a Python microservice running the Kociemba Two-Phase algorithm.

---

## 📑 Table of Contents
1. [Core Features](#-core-features)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Local Installation](#local-installation)
   - [Environment Variables](#environment-variables)
4. [Usage](#-usage)
5. [API Documentation](#-api-documentation)
6. [Roadmap](#-roadmap)
7. [Contributing](#-contributing)
8. [License](#-license)
9. [Contact](#-contact)

---

## ✨ Core Features

* **3D Interactive Engine (WebGL):** A custom-built, physics-based 3D Rubik's Cube built with React Three Fiber. Users can rotate the camera 360°, dynamically paint faces, and visualize solutions.
* **Animated Solution Playback:** The UI mathematically unwraps the Kociemba solution string and animates the 3D matrix permutations in real-time. Includes an interactive media player with variable playback speed (1x - 5x) and step-by-step navigation.
* **Computer Vision Integration:** Users can upload images of a physical cube. The OpenCV backend extracts HSV values, normalizes lighting, and maps the physical colors to a digital matrix.
* **Kociemba Algorithm:** Guarantees optimal mathematical solutions (under 20 moves) for any valid cube state.
* **Dynamic Center Mapping:** The logic engine reads the center tiles dynamically, allowing users to paint or upload the cube from any physical orientation without breaking the parity math.
* **Cold-Start Handling:** Graceful UI fallbacks and loading states to handle cloud server hibernation cycles seamlessly.

---

## 🏗️ Architecture & Tech Stack

This project utilizes a **Microservice Architecture** to separate the frontend rendering engine from the heavy Python algorithmic processing.

### Frontend (Client-Side)
* **Framework:** Next.js (App Router)
* **3D Rendering:** Three.js & React Three Fiber (`@react-three/drei`)
* **Styling:** Tailwind CSS (with complete Dark/Light mode support)
* **Icons:** Lucide React
* **Hosting:** Vercel

### Backend (Logic & Vision Engine)
* **Framework:** FastAPI (Python)
* **Algorithms:** Kociemba Two-Phase Algorithm
* **Computer Vision:** OpenCV (`opencv-python-headless`), NumPy
* **Hosting:** Render

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** or **yarn**
* **Python** (v3.9 or higher)
* **Git**

### Local Installation

Because this project uses a microservice architecture, you will need to run both the frontend and backend servers simultaneously.

#### 1. Backend Engine (`cube-api`)
```bash
# Clone the backend repository
   git clone [https://github.com/shai-tan1/cube-api.git](https://github.com/shai-tan1/cube-api.git)
   cd cube-api
```

#### 2. Create a virtual environment (Recommended)
```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate
```
#### 3. Install dependencies
```bash
   pip install -r requirements.txt
```

# Boot the FastAPI server
uvicorn main:app --reload --port 8000
The backend will now be listening at http://127.0.0.1:8000. You can view the interactive Swagger UI documentation at /docs.

2. Frontend Application (cube-solver)
Open a new terminal window:

Bash
# Clone the frontend repository
git clone [https://github.com/shai-tan1/CubeGoat.git](https://github.com/shai-tan1/CubeGoat.git)
cd CubeGoat

# Install Node modules
npm install

# Start the Next.js development server
npm run dev
The frontend will now be running at http://localhost:3000.

Environment Variables
To connect the frontend to the backend in production, create a .env.local file in the root of your CubeGoat frontend directory:

Code snippet
# Example .env.local
NEXT_PUBLIC_API_URL=[https://cube-api-su0x.onrender.com](https://cube-api-su0x.onrender.com)
(Note: If running locally, you can hardcode http://127.0.0.1:8000 or set the local ENV variable to match).

## 🎮 Usage

* **3D Paint Mode:** Left-click and drag the background to rotate the cube. Select a color from the palette and click a face to paint it. Click "Execute" to calculate the solution and reveal the media player.
* **Manual 2D Grid:** Switch to the 2D matrix view to rapidly map out a cube state using standard unfolded notation.
* **Computer Vision:** Switch to "Image Upload" mode. Upload a clear, well-lit photo of a single cube face. The OpenCV engine will extract the 9 colors and auto-populate the state.

---

## 📡 API Documentation

The FastAPI microservice exposes the following core endpoints:

### `POST /api/solve`
* **Payload:** `{ "state": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB" }`
* **Response:** `{ "solution": ["U", "R2", "F'", "D", "L2"] }`
* **Description:** Accepts a 54-character string and returns an array of optimal moves. Throws a `400 Bad Request` if the state violates parity laws.

### `POST /api/vision/extract`
* **Payload:** Multipart Form Data (Image File)
* **Response:** `{ "colors": ["Red", "White", "Blue", "Red", "Red", "Yellow", "Green", "White", "Orange"] }`
* **Description:** Resizes the image, samples HSV median arrays across a 3x3 grid, and returns the 9 mapped color classifications.

---

## 🗺️ Roadmap

- [x] Integrate Kociemba Algorithm
- [x] Build 2D Manual Grid UI
- [x] Build OpenCV HSV Extraction pipeline
- [x] Implement Three.js 3D Interactive Canvas
- [x] Build Mathematical 3D Solution Animator
- [ ] Add WebRTC Camera support for live video extraction
- [ ] Implement user accounts to save solve times and history

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines
* Ensure your code adheres to the existing ESLint and Prettier configurations.
* If modifying the 3D physics engine, please include comments explaining the vector math.
* Update the `README.md` with details of changes to the interface, new environment variables, or new API endpoints.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact

**Shaunak Samanta** GitHub: [@shai-tan1](https://github.com/shai-tan1)  
Project Link: [CubeGoat](https://github.com/shai-tan1/CubeGoat)