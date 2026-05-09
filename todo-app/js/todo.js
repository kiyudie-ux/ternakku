/**
 * Todo Manager
 * Handles todo operations and business logic
 */

class TodoManager {
    constructor() {
        this.todos = storage.getTodos();
        this.editingId = null;
    }

    /**
     * Create a new todo
     * @param {string} text - Todo text
     * @param {string} priority - Priority level (low, medium, high)
     * @param {string} notes - Additional notes
     * @returns {Object} Created todo object
     */
    createTodo(text, priority = 'low', notes = '') {
        if (!text.trim()) {
            throw new Error('Todo text cannot be empty');
        }

        const todo = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            priority: priority || 'low',
            notes: notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.todos.push(todo);
        storage.saveTodos(this.todos);
        return todo;
    }

    /**
     * Update a todo
     * @param {string} id - Todo ID
     * @param {Object} updates - Fields to update
     */
    updateTodo(id, updates) {
        const todo = this.getTodo(id);
        if (!todo) {
            throw new Error('Todo not found');
        }

        Object.assign(todo, updates);
        todo.updatedAt = new Date().toISOString();
        storage.saveTodos(this.todos);
    }

    /**
     * Toggle todo completion status
     * @param {string} id - Todo ID
     */
    toggleTodo(id) {
        const todo = this.getTodo(id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            storage.saveTodos(this.todos);
        }
    }

    /**
     * Delete a todo
     * @param {string} id - Todo ID
     */
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        storage.saveTodos(this.todos);
    }

    /**
     * Get a todo by ID
     * @param {string} id - Todo ID
     * @returns {Object} Todo object
     */
    getTodo(id) {
        return this.todos.find(todo => todo.id === id);
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        storage.saveTodos(this.todos);
    }

    /**
     * Delete all todos
     */
    deleteAll() {
        this.todos = [];
        storage.deleteAll();
    }

    /**
     * Get todos by filter
     * @param {string} filter - Filter type (all, active, completed)
     * @returns {Array} Filtered todos
     */
    filterTodos(filter) {
        switch (filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    /**
     * Sort todos
     * @param {string} sortBy - Sort criteria
     * @param {Array} todos - Todos to sort
     * @returns {Array} Sorted todos
     */
    sortTodos(sortBy, todos) {
        const sorted = [...todos];

        switch (sortBy) {
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            case 'name':
                return sorted.sort((a, b) => a.text.localeCompare(b.text));
            default:
                return sorted;
        }
    }

    /**
     * Search todos
     * @param {string} query - Search query
     * @returns {Array} Matching todos
     */
    searchTodos(query) {
        const lowerQuery = query.toLowerCase();
        return this.todos.filter(todo => 
            todo.text.toLowerCase().includes(lowerQuery) ||
            todo.notes.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get statistics
     * @returns {Object} Statistics
     */
    getStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;

        return {
            total,
            completed,
            active,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export todos
     * @returns {string} JSON string
     */
    exportTodos() {
        return storage.exportTodos();
    }

    /**
     * Import todos
     * @param {string} jsonString - JSON string
     * @returns {boolean} Success status
     */
    importTodos(jsonString) {
        const success = storage.importTodos(jsonString);
        if (success) {
            this.todos = storage.getTodos();
        }
        return success;
    }

    /**
     * Format date
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }
}

// Create global instance
const todoManager = new TodoManager();
