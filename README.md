# GTD Productivity App

A React Native mobile application built with Expo that implements the Getting Things Done (GTD) methodology for personal productivity.

## Features

### 🔶 Capture (Inbox)
- Quick task entry with a simple input field
- All new items go directly to the inbox for later processing
- Clean, distraction-free interface for rapid capture

### 🔶 Process & Organize
- Process inbox items by moving them to projects or defining as next actions
- Create new projects with descriptions
- Assign contexts to next actions (@computer, @home, @errands, etc.)
- Delete unnecessary items

### 🔶 Engage (Next Actions)
- View all actionable items in one place
- Filter by context (where you can do the task)
- Filter by project (what larger goal it belongs to)
- Mark tasks as complete with a simple tap
- Visual indicators for task status and progress

### 🔶 Projects Overview
- Track all active projects
- Visual progress bars showing completion percentage
- Task counts and completion statistics
- Project descriptions and creation dates

## Installation & Setup

### Prerequisites
- Node.js (14.x or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahsasnagar11/GTD-Productivity-App
   cd GTDProductivityApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Usage Guide

### Getting Started
1. **Capture**: Start by adding any tasks, ideas, or to-dos in the Inbox tab
2. **Process**: Tap "Process" on each inbox item to decide what to do with it:
   - Move to an existing project
   - Create a new project
   - Make it a next action with a context
3. **Engage**: Use the Next Actions tab to see what you can do right now
4. **Review**: Check the Projects tab to see overall progress

### Best Practices
- **Capture everything**: Don't let anything stay in your head
- **Process regularly**: Clear your inbox daily
- **Use contexts**: Group actions by where/how you can do them
- **Review weekly**: Check project progress and adjust as needed

## Technical Architecture

### Component Structure
```
App.js (Main Component)
├── GTDContext (State Management)
├── Navigation (Tab Navigation)
├── InboxScreen (Capture & Process)
├── NextActionsScreen (Engage)
└── ProjectsScreen (Review)
```

### Data Models
```javascript
Task: {
  id: string,
  title: string,
  status: 'inbox' | 'next-action' | 'project',
  context: string | null,
  projectId: string | null,
  completed: boolean,
  createdAt: string
}

Project: {
  id: string,
  name: string,
  description: string,
  createdAt: string
}
```

### State Management
- Uses React Context for global state management
- No external dependencies (Redux, etc.) for simplicity
- All data is stored in memory (production apps would use persistent storage)

## Customization

### Adding New Contexts
Modify the `contexts` array in the main App component:
```javascript
const [contexts, setContexts] = useState([
  '@computer', '@home', '@errands', '@phone', '@office',
  '@your-custom-context' // Add your custom contexts here
]);
```

### Styling
All styles are defined in the `styles` object at the bottom of App.js. Key design principles:
- Clean, minimal interface
- Consistent spacing and typography
- Color-coded elements (contexts, projects, actions)
- Accessible touch targets

## Known Limitations

1. **Data Persistence**: Data is not saved between app sessions (in-memory only)
2. **Collaboration**: Single-user application
3. **Synchronization**: No cloud sync or backup
4. **Advanced GTD Features**: Missing some advanced GTD concepts like:
   - Someday/Maybe lists
   - Reference materials
   - Calendar integration
   - Review checklists

## Future Enhancements

- [ ] Persistent data storage (AsyncStorage or SQLite)
- [ ] Cloud synchronization
- [ ] Push notifications and reminders
- [ ] Calendar integration
- [ ] Someday/Maybe list
- [ ] Search and advanced filtering
- [ ] Data export/import
- [ ] Dark mode support
- [ ] Accessibility improvements

## Development Notes

### Code Organization
- Single-file approach for simplicity (production apps should be modularized)
- Functional components with hooks throughout
- Comprehensive commenting for learning purposes
- Modern React Native patterns and best practices

### Performance Considerations
- FlatList for efficient rendering of large lists
- Optimized re-renders with proper key props
- Minimal state updates to prevent unnecessary renders

### Testing Strategy
- Manual testing on iOS and Android
- Edge case handling (empty states, long text, etc.)
- User experience validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on David Allen's "Getting Things Done" methodology
- Built with React Native and Expo
- UI inspiration from modern productivity apps

---


