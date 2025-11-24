# Contributing to AI Verifier

Thank you for your interest in contributing to AI Verifier! This project welcomes contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

This project adheres to a simple code of conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Node.js version, .NET version)
- **Screenshots** if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Use case** - Why is this enhancement needed?
- **Proposed solution** - How should it work?
- **Alternatives considered** - What other approaches did you think about?
- **Additional context** - Any other relevant information

### Code Contributions

We welcome code contributions! Here are some areas:

1. **Bug fixes**
2. **New verification algorithms**
3. **Additional AI provider integrations**
4. **Documentation improvements**
5. **Test coverage expansion**
6. **Performance optimizations**
7. **UI/UX enhancements**

## 🛠️ Development Setup

### TypeScript Backend

```bash
# Clone the repository
git clone https://github.com/your-username/ai-verifier.git
cd ai-verifier/backend-typescript

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run in development mode
npm run dev

# Run tests
npm test
```

### .NET Backend

```bash
cd backend/AIVerifier.API

# Restore packages
dotnet restore

# Run in development mode
dotnet run

# Run tests
dotnet test
```

### Frontend

```bash
cd frontend/ai-verifier-dashboard

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes** following our code standards

4. **Test your changes**:
   - Run existing tests: `npm test` or `dotnet test`
   - Add new tests for new features
   - Ensure all tests pass

5. **Commit your changes**:
   ```bash
   git commit -m "Add feature: brief description"
   # or
   git commit -m "Fix: brief description of bug fix"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Link to related issue(s) if applicable
   - Screenshots for UI changes

8. **Wait for review** - Maintainers will review and may request changes

9. **Address feedback** if needed

10. **Merge** - Once approved, your PR will be merged!

## 📝 Code Standards

### TypeScript/JavaScript

- **Use TypeScript** for type safety
- **Follow ESLint rules** - Run `npm run lint`
- **Use async/await** instead of callbacks
- **Add JSDoc comments** for public APIs
- **Keep functions small** (<50 lines ideally)
- **Use meaningful variable names**

```typescript
// Good
async function verifyAIResponse(request: VerificationRequest): Promise<VerificationResult> {
  // Implementation
}

// Bad
async function verify(r: any): Promise<any> {
  // Implementation
}
```

### C#/.NET

- **Follow Microsoft naming conventions**
- **Use async/await** for I/O operations
- **Add XML documentation** for public APIs
- **Keep methods focused** (single responsibility)
- **Use dependency injection**

```csharp
// Good
/// <summary>
/// Verifies an AI response using multiple validation methods
/// </summary>
public async Task<VerificationResult> VerifyAsync(VerificationRequest request)
{
    // Implementation
}

// Bad
public async Task<object> Verify(object request)
{
    // Implementation
}
```

### General Principles

- **DRY** - Don't Repeat Yourself
- **SOLID** - Follow SOLID principles
- **KISS** - Keep It Simple, Stupid
- **YAGNI** - You Aren't Gonna Need It

## 🧪 Testing Guidelines

### Writing Tests

1. **Unit Tests** - Test individual components in isolation
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test full user workflows

### Test Structure

```typescript
describe('ConsistencyChecker', () => {
  it('should return high score for consistent responses', async () => {
    // Arrange
    const request = createTestRequest();
    
    // Act
    const result = await checker.check(request);
    
    // Assert
    expect(result.score).toBeGreaterThan(0.8);
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- Focus on **critical paths** and **edge cases**
- Don't write tests just for coverage - write meaningful tests

## 📚 Documentation

When adding features, update:

- **README.md** - If user-facing changes
- **Code comments** - For complex logic
- **API documentation** - For new endpoints
- **CHANGELOG.md** - Describe what changed

## 🎨 UI/UX Guidelines

For frontend contributions:

- **Mobile-first** design approach
- **Accessibility** - Follow WCAG 2.1 AA standards
- **Consistent styling** - Use existing color palette
- **Performance** - Optimize for fast load times
- **User feedback** - Show loading states, errors clearly

## 🐛 Debugging Tips

### Backend

```bash
# TypeScript - Enable debug mode
DEBUG=* npm run dev

# .NET - Run with verbose logging
dotnet run --configuration Debug
```

### Frontend

- Use React DevTools
- Check browser console for errors
- Use network tab to debug API calls

## 🚀 Release Process

Maintainers will handle releases:

1. Update version in `package.json` / `.csproj`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.2.3`
4. Push tag: `git push origin v1.2.3`
5. Create GitHub release with notes
6. Publish to npm/NuGet if applicable

## ❓ Questions?

- **Check existing issues** - Your question may already be answered
- **Open a discussion** - For general questions
- **Open an issue** - For specific bugs or feature requests

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AI Verifier!** 🎉

Every contribution, no matter how small, helps make this project better for everyone.
