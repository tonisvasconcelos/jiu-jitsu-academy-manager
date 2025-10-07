# Instagram Stories Sharing Feature

## Overview
This feature allows users to generate Instagram Stories-style images from class schedule information. When users click the share icon on the class edit/view page, it creates a beautiful, formatted image that can be downloaded or shared directly to social media.

## Features

### 🎨 **Instagram Stories Format**
- **Dimensions**: 1080x1920 pixels (standard Instagram Stories size)
- **Gradient Background**: Beautiful purple-to-pink gradient with decorative elements
- **Professional Layout**: Clean, modern design with proper typography hierarchy

### 📋 **Class Information Display**
The generated story includes:
- **Class Name**: Prominently displayed at the top
- **Class Type & Categories**: Type, gender category, and age category
- **Schedule Details**: Days of week, time, and duration
- **Location**: Branch and facility information
- **Instructor**: Teacher name
- **Modalities**: Fight modalities with proper formatting
- **Capacity**: Current enrollment vs. maximum capacity
- **Price**: If applicable

### 🚀 **Functionality**
- **One-Click Generation**: Simple button click to create the story
- **Preview Modal**: Shows the generated image before sharing
- **Download Option**: Save the image to device
- **Native Sharing**: Uses Web Share API when available
- **Fallback Support**: Downloads image if sharing is not supported

## Usage

### For Users
1. Navigate to any existing class (edit or view mode)
2. Click the share icon (📤) in the top-right corner of the page
3. Wait for the image to generate
4. Preview the story in the modal
5. Choose to download or share directly

### For Developers
The feature is implemented through the `ShareIcon` component:

```tsx
import ShareIcon from '../components/ShareIcon'

// Usage in any component with class data
<ShareIcon 
  classData={classScheduleData} 
  className="optional-custom-styles"
/>
```

## Technical Implementation

### Components
- **ShareIcon.tsx**: Main component handling the sharing functionality
- **Canvas-based Generation**: Uses HTML5 Canvas for image creation
- **Responsive Design**: Adapts to different screen sizes

### Dependencies
- React hooks for state management
- HTML5 Canvas API for image generation
- Web Share API for native sharing (with fallback)
- Context providers for data access

### Data Sources
The component automatically fetches related data from:
- `BranchContext`: For branch names
- `BranchFacilityContext`: For facility names  
- `TeacherContext`: For instructor names
- `FightModalityContext`: For modality names

## Customization

### Styling
The component accepts a `className` prop for custom styling:
```tsx
<ShareIcon 
  classData={classData} 
  className="custom-share-button-styles"
/>
```

### Layout Modifications
To modify the story layout, edit the canvas drawing code in `ShareIcon.tsx`:
- Background gradients and colors
- Text positioning and fonts
- Information display order
- Decorative elements

## Browser Support
- **Modern Browsers**: Full support with Web Share API
- **Older Browsers**: Fallback to download functionality
- **Mobile**: Optimized for mobile sharing

## Future Enhancements
- [ ] Multiple story templates
- [ ] Custom branding options
- [ ] QR code integration
- [ ] Social media platform-specific formats
- [ ] Batch story generation for multiple classes

## Example Generated Story
The generated story will look like a professional Instagram Story with:
- Gradient background (purple to pink)
- Class name prominently displayed
- All relevant class information organized clearly
- Professional typography and spacing
- Call-to-action at the bottom

This feature enhances the user experience by making it easy to promote classes on social media platforms, increasing engagement and class enrollment.
