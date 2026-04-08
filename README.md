# LuminaCode - Advanced Code Quality Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)

LuminaCode is a comprehensive code quality analysis platform that helps developers identify security vulnerabilities, code smells, complexity issues, and maintainability problems in their codebase. Built with modern web technologies and powered by intelligent analysis algorithms.

## 🌟 Features

### 🔍 Code Analysis
- **Static Code Analysis**: Detect code smells, anti-patterns, and structural issues
- **Security Vulnerability Detection**: Identify SQL injection, hardcoded secrets, buffer overflows, and other security risks
- **Complexity Analysis**: Calculate cyclomatic complexity and provide optimization suggestions
- **Multi-language Support**: Analyze code in Python, Java, JavaScript, and more

### 📊 Visual Analytics
- **Interactive Dashboard**: Real-time health scores and metrics
- **Dependency Graph Visualization**: Visual representation of code structure and relationships
- **Health Score Tracking**: Monitor code quality trends over time
- **Issue Management**: Track open issues and fixed problems

### 🤖 AI-Powered Assistant
- **Lumina Chatbot**: Get instant advice on code quality, security, and optimization
- **Contextual Recommendations**: Receive specific suggestions based on your code analysis
- **Educational Insights**: Learn about best practices and common pitfalls

### 🛠️ Development Tools
- **Code Sandbox**: Safe execution environment for testing code snippets
- **Automated Fixer**: Generate fixes for common code quality issues
- **Real-time Analysis**: Instant feedback as you write code

## 🏗️ Architecture

```
LuminaCode/
├── backend/          # FastAPI Python server
│   ├── main.py      # Core API endpoints
│   └── requirements.txt
└── frontend/         # React + Vite client
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── context/
    ├── package.json
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/luminacode.git
   cd luminacode
   ```

2. **Set up Python environment**
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install fastapi uvicorn pydantic
   ```

4. **Start the backend server**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📖 Usage

### Analyzing Code

1. Navigate to the **Analysis** page
2. Paste your code or upload a file
3. Select the programming language
4. Click **Analyze** to get comprehensive quality metrics

### Security Scanning

1. Go to the **Security** tab
2. Review detected vulnerabilities
3. Get detailed remediation steps

### Visualizing Dependencies

1. Visit the **Graph View** page
2. Explore the interactive code structure visualization
3. Identify complex relationships and potential refactoring opportunities

### Using the Chatbot

1. Access the **Chatbot** from any page
2. Ask questions about code quality, security, or best practices
3. Get instant, contextual advice

## 🧪 Testing Code Safely

Use the **Sandbox** feature to execute code snippets in a controlled environment:

1. Go to the Sandbox page
2. Write or paste your code
3. Click **Execute** to see the output
4. Note: System modules are restricted for security

## 🛠️ Development

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in the 'dist' directory
```

### API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript/React
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/) for the backend
- Frontend powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts and graphs using [Recharts](https://recharts.org/)

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Happy coding with LuminaCode! 🚀**
