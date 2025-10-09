# Debugging with Production Source Maps

This document explains how to debug production builds using source maps that are now enabled in this project.

## Overview

Production source maps have been enabled in `vite.config.ts` to make debugging production issues easier. When errors occur in production, you'll now see readable stack traces instead of minified code.

## Configuration

Source maps are enabled in `vite.config.ts`:

```typescript
build: {
  outDir: 'dist',
  sourcemap: true, // ✅ Enabled for production debugging
  // ... other config
}
```

## How to Use Source Maps

### 1. **Browser Developer Tools**

When an error occurs in production:

1. Open browser Developer Tools (F12)
2. Go to the **Console** tab
3. Look for error stack traces - they should now show:
   - Original file names (e.g., `LanguageSelector.tsx:45`)
   - Original function names
   - Readable line numbers

### 2. **Error Boundary Integration**

The app now includes comprehensive error boundaries that:

- Catch runtime errors gracefully
- Display user-friendly error messages
- Log detailed error information to console
- Show development error details when in development mode

### 3. **Production Error Logging**

Errors are automatically logged with:
- Component stack traces
- Error details
- Context information

## Example Error Output

**Before (minified):**
```
TypeError: Cannot read properties of undefined (reading 'length')
    at Cx (vendor-3c8011bb.js:1:52549)
    at vendor-3c8011bb.js:1:12345
```

**After (with source maps):**
```
TypeError: Cannot read properties of undefined (reading 'length')
    at LanguageSelector.tsx:45:12
    at useLanguage (LanguageContext.tsx:1789:5)
    at LanguageProvider (LanguageContext.tsx:1812:3)
```

## Debugging Workflow

### 1. **Reproduce the Issue**
- Navigate to the production build
- Trigger the error condition
- Check browser console for detailed error information

### 2. **Analyze the Stack Trace**
- Look for the original file names and line numbers
- Identify the component and function where the error occurred
- Check the error boundary logs for additional context

### 3. **Local Development**
- Use the same error conditions in local development
- Set breakpoints in the identified files
- Debug with full source code visibility

### 4. **Fix and Test**
- Implement the fix locally
- Test the fix thoroughly
- Deploy and verify the fix works in production

## Error Boundary Features

The `ErrorBoundary` component provides:

### **User Experience**
- Graceful error handling
- User-friendly error messages
- "Try Again" and "Refresh Page" options
- Consistent error UI across the app

### **Developer Experience**
- Detailed error logging
- Component stack traces
- Development error details
- Error reporting integration ready

### **Usage Example**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Best Practices

### 1. **Error Handling**
- Always wrap components with error boundaries
- Provide meaningful error messages
- Log errors for debugging
- Gracefully degrade functionality when possible

### 2. **Source Maps**
- Keep source maps enabled in production for debugging
- Monitor bundle size impact
- Consider removing source maps after critical issues are resolved

### 3. **Testing**
- Test error conditions in development
- Verify error boundaries work correctly
- Test production builds locally before deployment

## File Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx          # Global error boundary
│   ├── LanguageSelector.tsx       # Fixed language selector
│   └── __tests__/
│       └── LanguageSelector.test.tsx  # Comprehensive tests
├── contexts/
│   └── LanguageContext.tsx        # Enhanced with error handling
└── App.tsx                        # Wrapped with error boundaries
```

## Monitoring and Alerts

Consider integrating with error monitoring services:

- **Sentry**: For production error tracking
- **LogRocket**: For session replay and error analysis
- **Bugsnag**: For real-time error monitoring

## Performance Considerations

- Source maps increase build size but don't affect runtime performance
- Error boundaries add minimal overhead
- Consider removing source maps after critical issues are resolved

## Troubleshooting

### **Source Maps Not Working**
1. Verify `sourcemap: true` in `vite.config.ts`
2. Check that `.map` files are generated in `dist/assets/`
3. Ensure browser developer tools are enabled

### **Error Boundary Not Catching Errors**
1. Verify error boundary wraps the component
2. Check that error occurs in React component lifecycle
3. Ensure error is not caught by other error handlers

### **Tests Failing**
1. Run tests with `npm test`
2. Check test coverage for error scenarios
3. Verify mock implementations are correct

## Conclusion

With source maps enabled and comprehensive error boundaries in place, debugging production issues should be significantly easier. The combination of readable stack traces, detailed error logging, and graceful error handling provides a robust foundation for maintaining a stable production application.
