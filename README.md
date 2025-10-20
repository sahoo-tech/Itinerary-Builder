# Vigovia Itinerary Builder

A comprehensive web-based travel itinerary management system designed to create professional travel itineraries with PDF generation capabilities.

## 🎯 Overview

Vigovia Itinerary Builder is a single-page application that helps travel agents and tour operators create detailed, professional travel itineraries. With its intuitive interface and comprehensive feature set, users can build complete travel packages including day-by-day activities, flight details, hotel bookings, payment plans, and more.

## ✨ Features

### Core Functionality
- **Trip Overview Management**: Customer details, trip duration, dates, and destinations
- **Day-by-Day Itinerary**: Dynamic daily activity planning with morning, afternoon, and evening sections
- **Flight Management**: Flight details with airline, route, and timing information
- **Hotel Bookings**: Check-in/out dates, nights, and accommodation details
- **Payment Planning**: Installment-based payment tracking with GST and TCS handling
- **Visa Information**: Visa type, validity, and processing details

### Advanced Features
- **Important Notes**: Structured note-taking with points and detailed descriptions
- **Scope of Service**: Service delivery timelines and support information
- **Inclusion Summary**: Categorized inclusions with status tracking
- **Activity Management**: Location-based activity planning with time requirements
- **Terms & Conditions**: Customizable terms and conditions section

### User Experience
- **Progress Tracking**: Visual progress indicator across sections
- **Live Preview**: Real-time itinerary preview with professional formatting
- **PDF Generation**: High-quality PDF export using jsPDF and html2canvas
- **Data Persistence**: Save/load drafts in JSON format
- **Example Data**: Pre-loaded sample data for quick testing
- **Responsive Design**: Mobile-friendly interface with modern UI

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Icons**: Font Awesome 6.0
- **PDF Generation**: jsPDF 2.5.1, html2canvas 1.4.1
- **Architecture**: ES6 Classes, Event-driven programming

## 📁 Project Structure

```
itenary_builder/
├── index.html          # Main HTML structure
├── app.js              # Core application logic
├── style.css           # Styling and layout
├── README.md           # Project documentation
├── .vscode/
│   └── settings.json   # VS Code configuration
└── .qodo/              # Development tools
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required

### Installation

1. Clone or download the project:
```bash
git clone <repository-url>
cd itenary_builder
```

2. Open the application:
```bash
# Simply open index.html in your browser
# Or use a local server for best experience:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Usage

1. **Start Building**: Open the application and begin with the Trip Overview section
2. **Add Content**: Use the sidebar navigation to move between sections
3. **Dynamic Content**: Click "Add" buttons to create days, flights, hotels, etc.
4. **Preview**: Use the "Preview" button to see your itinerary
5. **Save/Load**: Save drafts as JSON files or load example data
6. **Export**: Generate professional PDF documents

## 🎨 Design System

### Color Palette
- **Primary**: Teal variations (#32808D, #297480)
- **Secondary**: Brown/Slate tones (#5E5240, #133B3B)
- **Accent**: Red (#C0152F) and Orange (#A84B2F)
- **Background**: Cream tones (#FCFCF9, #FFFFD)

### Typography
- **Headers**: System fonts with proper hierarchy
- **Body**: Clean, readable typography
- **Icons**: Font Awesome integration

### Layout
- **Responsive Grid**: CSS Grid and Flexbox
- **Sidebar Navigation**: Fixed navigation with progress indicator
- **Dynamic Cards**: Expandable content sections
- **Modal System**: Overlay preview and interactions

## 📖 Key Components

### ItineraryBuilder Class
The main application controller that manages:
- Data state management
- Event binding and handling
- Dynamic content rendering
- Form validation and updates
- PDF generation and preview

### Data Structure
```javascript
{
  trip_overview: {},      // Customer and trip details
  days: [],              // Day-by-day activities
  flights: [],           // Flight information
  hotels: [],            // Hotel bookings
  payment_plan: {},      // Payment and installments
  visa_details: {},      // Visa information
  important_notes: [],   // Structured notes
  scope_of_service: [],  // Service details
  inclusion_summary: [], // Included items
  activities: [],        // Activity listings
  terms: ''             // Terms and conditions
}
```

### Key Methods
- `loadSection()`: Navigation between sections
- `addDay()`, `addFlight()`, `addHotel()`: Dynamic content creation
- `generatePDF()`: PDF export functionality
- `previewItinerary()`: Live preview generation
- `saveDraft()`, `loadDraft()`: Data persistence

## 🔧 Customization

### Adding New Sections
1. Add navigation item to `index.html`
2. Create form section in main content area
3. Add data structure to `this.data` object
4. Implement rendering methods in `app.js`
5. Add to preview generation

### Styling Modifications
- Edit CSS custom properties in `:root`
- Modify component styles in `style.css`
- Adjust responsive breakpoints

### Feature Extensions
- Add new form fields to existing sections
- Implement additional export formats
- Integrate with external APIs
- Add authentication and user management

## 🎯 Use Cases

- **Travel Agencies**: Create professional client itineraries
- **Tour Operators**: Package tour documentation
- **Corporate Travel**: Business trip planning
- **Personal Travel**: Detailed vacation planning
- **Travel Consultants**: Client proposal generation

## 🔒 Data Privacy

- All data processing happens client-side
- No data transmitted to external servers
- Local storage for draft management
- Export control remains with user

## 🐛 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 11 (limited support)

## 📝 Development Notes

### Code Organization
- Modular class-based architecture
- Event-driven programming model
- Separation of data and presentation
- Reusable rendering methods

### Performance Considerations
- Efficient DOM manipulation
- Lazy loading of preview content
- Optimized PDF generation
- Memory management for large itineraries

**Vigovia Itinerary Builder** - *PLAN.PACK.GO!*