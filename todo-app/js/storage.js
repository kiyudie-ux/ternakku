/**
 * Local Storage Manager
 * Handles all local storage operations for todos
 */

class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'todos';
        this.SETTINGS_KEY = 'todoSettings';
    }

    /**
     * Get all todos from storage
     * @returns {Array} Array of todo objects
     */
    getTodos() {
        try {
            const todos = localStorage.getItem(this.STORAGE_KEY);
            return todos ? JSON.parse(todos) : [];
        } catch (error) {
            console.error('Error reading todos from storage:', error);
            return [];
        }
    }

    /**
     * Save todos to storage
     * @param {Array} todos - Array of todo objects to save
     */
    saveTodos(todos) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving todos to storage:', error);
            alert('Failed to save todos. Storage might be full.');
        }
    }

    /**
     * Add a single todo
     * @param {Object} todo - Todo object to add
     */
    addTodo(todo) {
        const todos = this.getTodos();
        todos.push(todo);
        this.saveTodos(todos);
    }

    /**
     * Update a todo
     * @param {string} id - Todo ID
     * @param {Object} updates - Fields to update
     */
    updateTodo(id, updates) {
        let todos = this.getTodos();
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
        );
        this.saveTodos(todos);
    }

    /**
     * Delete a todo
     * @param {string} id - Todo ID
     */
    deleteTodo(id) {
        let todos = this.getTodos();
        todos = todos.filter(todo => todo.id !== id);
        this.saveTodos(todos);
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        let todos = this.getTodos();
        todos = todos.filter(todo => !todo.completed);
        this.saveTodos(todos);
    }

    /**
     * Delete all todos
     */
    deleteAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Export todos as JSON
     * @returns {string} JSON string of todos
     */
    exportTodos() {
        const todos = this.getTodos();
        const metadata = {
            exportDate: new Date().toISOString(),
            totalTodos: todos.length,
            completedTodos: todos.filter(t => t.completed).length,
            todos: todos
        };
        return JSON.stringify(metadata, null, 2);
    }

    /**
     * Import todos from JSON
     * @param {string} jsonString - JSON string of todos
     * @returns {boolean} Success status
     */
    importTodos(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const todos = data.todos || data;
            
            // Validate todos structure
            if (!Array.isArray(todos)) {
                throw new Error('Invalid todos format');
            }
            
            this.saveTodos(todos);
            return true;
        } catch (error) {
            console.error('Error importing todos:', error);
            return false;
        }
    }

    /**
     * Get settings
     * @returns {Object} Settings object
     */
    getSettings() {
        try {
            const settings = localStorage.getItem(this.SETTINGS_KEY);
            return settings ? JSON.parse(settings) : {
                darkMode: false,
                sortBy: 'date-desc',
                filterBy: 'all'
            };
        } catch (error) {
            console.error('Error reading settings:', error);
            return {
                darkMode: false,
                sortBy: 'date-desc',
                filterBy: 'all'
            };
        }
    }

    /**
     * Save settings
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Get storage info
     * @returns {Object} Storage info
     */
    getStorageInfo() {
        const todos = this.getTodos();
        const storageUsed = new Blob([localStorage.getItem(this.STORAGE_KEY)]).size;
        
        return {
            totalTodos: todos.length,
            completedTodos: todos.filter(t => t.completed).length,
            activeTodos: todos.filter(t => !t.completed).length,
            storageUsed: storageUsed,
            storageUsedMB: (storageUsed / 1024 / 1024).toFixed(2)
        };
    }
}

// Create global instance
const storage = new StorageManager();
