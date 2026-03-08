# Contributing Guidelines

Thank you for your interest in contributing to the Firebase Express E-Commerce Application! Please follow these guidelines when contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Maintain professional communication
- Focus on constructive feedback

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly before submitting
6. Commit with clear, descriptive messages
7. Push to your fork
8. Create a Pull Request with a detailed description

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/firebase-express-ecommerce.git
cd firebase-express-ecommerce

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Add Firebase service account key
# Download from Firebase Console and save as serviceAccountKey.json

# Start development server
npm run dev
```

## Code Style Guidelines

- **Indentation**: Use 2 spaces
- **Naming**: Use camelCase for variables and functions, PascalCase for classes
- **Files**: Use .js for JavaScript, .ejs for templates
- **Comments**: Add comments for complex logic
- **Async/Await**: Use async/await for promises instead of .then()
- **Error Handling**: All async operations must have try/catch blocks

## Git Commit Messages

Write clear, descriptive commit messages:

```
<type>: <short description>

<longer description if needed>

Examples:
- feat: Add dark mode toggle to admin dashboard
- fix: Correct session timeout calculation
- docs: Update README deployment instructions
- refactor: Improve product filtering logic
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Dependency updates, build changes

## Pull Request Process

1. **Descriptive Title**: Use a clear, concise title
2. **Description**: Explain what changes you made and why
3. **Testing**: Confirm the app runs without errors
4. **No Secrets**: Never commit Firebase keys, API keys, or sensitive data
5. **Updated Docs**: Update README or documentation if needed
6. **Linked Issues**: Reference any related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] No console.log debug statements remain
- [ ] All errors are properly handled
- [ ] README is updated if needed
- [ ] No sensitive data is committed
```

## Testing

Before submitting a PR:

1. Test all modified features locally
2. Check that existing features still work
3. Verify no console errors in browser
4. Test admin pages if changes affect admin functionality
5. Test responsive design on mobile

## Security

- **Never commit** `serviceAccountKey.json`
- **Never commit** `.env` files with real credentials
- **Always use** environment variables for secrets
- **Validate** all user input
- **Hash** passwords with bcrypt
- **Use HTTPS** in production

## Reporting Issues

When reporting a bug, include:

- **Description**: What is the issue?
- **Steps to Reproduce**: How can we reproduce it?
- **Expected Behavior**: What should happen?
- **Actual Behavior**: What actually happens?
- **Environment**: Node version, OS, browser (if relevant)
- **Screenshots**: If applicable

## Project Structure

```
server.js              - Main Express server
routes/                - Request handlers
controllers/           - Business logic
models/                - Database operations
middleware/            - Express middleware
views/                 - EJS templates
public/                - Static assets
scripts/               - Utility scripts
```

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore
- **Frontend**: EJS templates
- **Security**: bcrypt, express-session
- **Environment**: dotenv

## Questions?

- Check the README for setup instructions
- Review existing code for patterns
- Open a discussion or issue if you have questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
