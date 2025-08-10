# Frontend Testing Guide

This guide provides comprehensive testing instructions for the Airbnb Clone frontend application.

## Table of Contents
1. [Setup](#setup)
2. [Automated Testing](#automated-testing)
3. [Manual Testing](#manual-testing)
4. [Test Scenarios](#test-scenarios)
5. [Bug Reporting](#bug-reporting)

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend server running on `http://localhost:5000`

### Installation
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Ensure your `.env` file contains:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## Automated Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ListingDetail.test.js
```

### Test Structure
The test files are organized into test suites:
- `Authentication Tests` - User registration, login, logout
- `Listing Management Tests` - CRUD operations for listings
- `Listing Detail Tests` - Individual listing page functionality
- `Search and Filter Tests` - Search and filtering capabilities
- `Messaging Tests` - Real-time messaging system
- `Review System Tests` - Review functionality
- `User Profile Tests` - Profile management
- `Error Handling Tests` - Error scenarios
- `Responsive Design Tests` - Mobile/tablet/desktop layouts
- `Performance Tests` - Load times and optimization
- `Security Tests` - Security vulnerabilities
- `Accessibility Tests` - Accessibility compliance

## Manual Testing

### Pre-Testing Checklist
- [ ] Backend server is running
- [ ] Database is connected
- [ ] Frontend is running on `http://localhost:3000`
- [ ] Browser developer tools are open
- [ ] Network tab is monitoring API calls

### Testing Tools
- **Browser Developer Tools**: For debugging and network monitoring
- **React Developer Tools**: For component inspection
- **Lighthouse**: For performance and accessibility testing
- **Postman/Insomnia**: For API testing
- **Mobile Device Simulator**: For responsive testing

## Test Scenarios

### 1. Authentication Flow

#### User Registration
1. Navigate to `/register`
2. Fill in registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Submit form
4. **Expected**: Success message, redirect to login or dashboard

#### User Login
1. Navigate to `/login`
2. Fill in login form:
   - Email: "test@example.com"
   - Password: "password123"
3. Submit form
4. **Expected**: JWT token stored, user data loaded, redirect to home

#### Google OAuth
1. Click "Continue with Google" button
2. Complete Google OAuth flow
3. **Expected**: Successful login with Google account data

#### Logout
1. Click logout button
2. **Expected**: JWT token removed, redirect to home, protected routes inaccessible

### 2. Listing Management

#### Create Listing
1. Login as user
2. Navigate to `/create-listing`
3. Fill in form:
   - Title: "Beautiful Beach House"
   - Description: "Amazing ocean view property"
   - Location: "Miami Beach, FL"
   - Price: 150
   - Upload image(s)
4. Submit form
5. **Expected**: Success message, redirect to listing detail page

#### Edit Listing
1. Navigate to listing detail page (owned by current user)
2. Click "Edit Listing" button
3. Modify details
4. Save changes
5. **Expected**: Changes reflected, non-owners cannot edit

#### Delete Listing
1. Navigate to listing detail page (owned by current user)
2. Click "Delete Listing" button
3. Confirm deletion
4. **Expected**: Listing removed, redirect to my-listings

### 3. Search and Filter

#### Search Functionality
1. Navigate to home page
2. Enter search term in search box
3. **Expected**: Filtered results, case-insensitive search

#### Location Filter
1. Select location from dropdown
2. **Expected**: Only listings from selected location

#### Sort Options
1. Select "Sort by Price"
2. **Expected**: Listings sorted by price (low to high)
3. Select "Sort by Date"
4. **Expected**: Listings sorted by creation date (newest first)

### 4. Messaging System

#### Send Message
1. Login as user
2. Navigate to listing detail page (not owned by user)
3. Type message in message box
4. Send message
5. **Expected**: Message appears in conversation, real-time delivery

#### Message Encryption
1. Send message with sensitive content
2. **Expected**: Message encrypted in transit, decrypted for recipient

### 5. Review System

#### Add Review
1. Login as user
2. Navigate to listing detail page
3. Fill in review form:
   - Rating: 5 stars
   - Comment: "Excellent property!"
4. Submit review
5. **Expected**: Review appears, average rating updated

#### Edit/Delete Review
1. Navigate to listing with user's review
2. Click "Edit" or "Delete"
3. **Expected**: Only review author can edit/delete

### 6. User Profile

#### View Profile
1. Login as user
2. Navigate to `/profile`
3. **Expected**: User information displayed, avatar shown

#### Update Profile
1. Modify profile information
2. Save changes
3. **Expected**: Changes reflected, persist after logout/login

#### Wishlist Management
1. Add items to wishlist
2. Navigate to `/wishlist`
3. **Expected**: Wishlist items displayed, remove functionality works

### 7. Error Handling

#### Invalid URLs
1. Navigate to `/listings/invalid-id`
2. **Expected**: Appropriate error message, no crash

#### Network Errors
1. Disconnect internet
2. Attempt to load listings
3. **Expected**: Error message, retry functionality

#### Authentication Errors
1. Use expired JWT token
2. Access protected route
3. **Expected**: Redirect to login, error message

### 8. Responsive Design

#### Mobile Testing
1. Set viewport to mobile size (320px-768px)
2. **Expected**: Layout adapts, navigation mobile-friendly

#### Tablet Testing
1. Set viewport to tablet size (768px-1024px)
2. **Expected**: Layout optimized for tablet

#### Desktop Testing
1. Set viewport to desktop size (1024px+)
2. **Expected**: Full layout, hover effects work

### 9. Performance Testing

#### Page Load Performance
1. Open browser developer tools
2. Navigate to home page
3. **Expected**: Load time under 3 seconds

#### Image Optimization
1. Check image loading
2. **Expected**: Progressive loading, proper sizing

### 10. Security Testing

#### XSS Prevention
1. Attempt to inject script tags in forms
2. **Expected**: Scripts not executed, content escaped

#### Input Sanitization
1. Test various input types with malicious content
2. **Expected**: Inputs properly sanitized

### 11. Accessibility Testing

#### Keyboard Navigation
1. Navigate entire app using only keyboard
2. **Expected**: All elements accessible, logical tab order

#### Screen Reader Compatibility
1. Use screen reader
2. **Expected**: Proper ARIA labels, semantic HTML

## Bug Reporting

### Bug Report Template
```
**Bug Title**: [Brief description]

**Severity**: [Critical/High/Medium/Low]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Environment**:
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Browser version]
- OS: [Windows/Mac/Linux]
- Frontend Version: [Git commit hash]

**Screenshots**: [If applicable]

**Console Errors**: [Any JavaScript errors]

**Network Errors**: [Any failed API calls]
```

### Common Issues and Solutions

#### Issue: "Cannot read properties of null (reading '_id')"
**Cause**: Listing owner data not properly populated
**Solution**: Check backend API response, ensure owner field is populated

#### Issue: Images not loading
**Cause**: Incorrect image path or CORS issues
**Solution**: Check image URLs, verify backend static file serving

#### Issue: WebSocket connection failed
**Cause**: WebSocket server not running or incorrect URL
**Solution**: Verify backend WebSocket server, check environment variables

#### Issue: Google OAuth not working
**Cause**: Incorrect redirect URI or missing environment variables
**Solution**: Check Google Cloud Console settings, verify environment variables

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Testing Tools
- **Lighthouse**: For performance audits
- **WebPageTest**: For detailed performance analysis
- **Chrome DevTools**: For real-time performance monitoring

## Accessibility Standards

### WCAG 2.1 Compliance
- **Level AA**: Minimum compliance target
- **Level AAA**: Recommended for full accessibility

### Testing Tools
- **axe DevTools**: For accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Screen Readers**: NVDA, JAWS, VoiceOver

## Security Checklist

### Frontend Security
- [ ] Input validation and sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Secure authentication
- [ ] HTTPS enforcement
- [ ] Content Security Policy

### Data Protection
- [ ] Sensitive data not stored in localStorage
- [ ] JWT tokens properly managed
- [ ] API calls use HTTPS
- [ ] User data encrypted in transit

## Continuous Testing

### Automated Testing Pipeline
1. **Unit Tests**: Run on every commit
2. **Integration Tests**: Run on pull requests
3. **E2E Tests**: Run on deployment
4. **Performance Tests**: Run weekly
5. **Security Tests**: Run monthly

### Test Coverage Goals
- **Unit Tests**: > 80% coverage
- **Integration Tests**: > 70% coverage
- **E2E Tests**: Critical user journeys

## Conclusion

This testing guide ensures comprehensive coverage of all frontend functionality. Regular testing helps maintain code quality and user experience. Update this guide as new features are added or issues are discovered. 