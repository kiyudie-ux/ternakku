# TODO App - Productivity Made Simple

A modern, feature-rich to-do list application with local storage functionality. Built with vanilla JavaScript, HTML, and CSS.

## 🚀 Features

### Core Features
- ✅ **Add/Edit/Delete Todos** - Manage your tasks with ease
- ✅ **Local Storage** - All data saved locally in browser
- ✅ **Task Completion** - Mark tasks as done
- ✅ **Priority Levels** - Organize by low, medium, high priority
- ✅ **Task Notes** - Add detailed notes to each task
- ✅ **Search Functionality** - Find tasks quickly
- ✅ **Filter Options** - View all, active, or completed tasks
- ✅ **Sort Options** - Sort by date, priority, or alphabetically
- ✅ **Statistics Dashboard** - View task counts and progress
- ✅ **Dark Mode** - Eye-friendly dark theme
- ✅ **Responsive Design** - Works on all devices
- ✅ **Export/Import** - Backup and restore tasks as JSON
- ✅ **Keyboard Shortcuts** - Press Enter to add tasks

## 📦 Installation

### Option 1: Direct File Usage
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start adding tasks!

### Option 2: With HTTP Server
```bash
npm install
npm start
```

This will start a local development server on port 8080.

## 🎯 Usage

### Adding Tasks
1. Type your task description in the input field
2. Click "Add" button or press Enter
3. Task appears in the list immediately

### Managing Tasks
- **Complete Task**: Click the checkbox next to the task
- **Edit Task**: Click the edit button to modify task, priority, or notes
- **Delete Task**: Click the trash button to remove task
- **View Notes**: Notes appear below task description

### Filtering & Sorting
- **Filter**: Choose All, Active, or Completed tasks
- **Sort**: Sort by newest, oldest, priority, or alphabetically
- **Search**: Use the search box to find specific tasks

### Maintenance
- **Clear Completed**: Remove all completed tasks at once
- **Export**: Download tasks as JSON file for backup
- **Import**: Load tasks from a previously exported JSON file
- **Reset**: Delete all tasks (warning: irreversible)

### Theme
- **Dark Mode**: Click the moon icon to toggle dark mode
- Settings are saved automatically

## 💾 Local Storage

All data is stored in your browser's localStorage:
- **Todos**: `todos` key contains all task data
- **Settings**: `todoSettings` key contains app preferences
- **Storage Limit**: Typically 5-10MB per domain
- **Persistence**: Data persists across browser sessions

## 📊 Data Structure

### Todo Object
```javascript
{
  id: "todo-1234567890-abc123def",
  text: "Task description",
  completed: false,
  priority: "medium",
  notes: "Additional notes",
  createdAt: "2026-05-09T10:30:00.000Z",
  updatedAt: "2026-05-09T10:30:00.000Z"
}
```

### Settings Object
```javascript
{
  darkMode: false,
  sortBy: "date-desc",
  filterBy: "all"
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
    /* ... more colors ... */
}
```

### Font
Change font family in `styles.css`:
```css
body {
    font-family: 'Your Font Name', sans-serif;
}
```

## 🔒 Privacy & Security

- ✅ All data stored locally (no server)
- ✅ No personal data collection
- ✅ No external API calls
- ✅ No tracking or analytics
- ✅ No authentication required
- ✅ Safe to use offline

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers
- ✅ Requires localStorage support

## ⚙️ Technical Details

### Architecture
- **StorageManager**: Handles localStorage operations
- **TodoManager**: Business logic for todo operations
- **UIManager**: DOM manipulation and rendering
- **App**: Main entry point and event coordination

### No Dependencies
- Pure vanilla JavaScript (no jQuery, React, etc.)
- Font Awesome for icons (CDN)
- CSS for styling (no frameworks)

## 🚀 Performance

- ✅ Instant load time
- ✅ Smooth animations
- ✅ No lag with hundreds of tasks
- ✅ Minimal memory footprint
- ✅ Fast search and filter

## 📝 Tips & Tricks

1. **Backup Regularly**: Export your tasks monthly
2. **Use Priorities**: Color-coded for quick scanning
3. **Add Notes**: Use notes for detailed information
4. **Search**: Searches both task and notes content
5. **Dark Mode**: Easy on the eyes for night work
6. **Statistics**: Check your productivity stats

## 🐛 Known Issues

- None reported. Submit issues on GitHub!

## 📋 Roadmap

Potential future features:
- Due dates and reminders
- Categories/Tags
- Recurring tasks
- Subtasks
- Undo/Redo functionality
- Cloud sync
- Sharing
- Collaboration

## 📄 License

MIT License - Feel free to use and modify

## 👨‍💻 Author

DIGJAYA - Productivity Tools

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Report bugs
2. Suggest features
3. Submit pull requests
4. Improve documentation

## 💬 Feedback

Have suggestions? Want to report a bug? Create an issue on GitHub!

---

**Made with ❤️ for productivity lovers everywhere**
