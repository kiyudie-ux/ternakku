/**
 * UI Manager
 * Handles all UI rendering and interactions
 */

class UIManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.searchQuery = '';
        this.initializeDOM();
    }

    /**
     * Initialize DOM elements
     */
    initializeDOM() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortSelect');
        this.searchInput = document.getElementById('searchInput');
        this.themeToggle = document.getElementById('themeToggle');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.editModal = document.getElementById('editModal');
        this.closeModal = document.getElementById('closeModal');
        this.cancelEdit = document.getElementById('cancelEdit');
        this.saveEdit = document.getElementById('saveEdit');
        this.editInput = document.getElementById('editInput');
        this.editPriority = document.getElementById('editPriority');
        this.editNotes = document.getElementById('editNotes');
        this.fileInput = document.getElementById('fileInput');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }

    /**
     * Render todos
     */
    render() {
        // Get todos based on current filter and search
        let todos = todoManager.filterTodos(this.currentFilter);
        
        if (this.searchQuery) {
            todos = todos.filter(todo => 
                todo.text.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                todo.notes.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Sort todos
        todos = todoManager.sortTodos(this.currentSort, todos);

        // Clear todo list
        this.todoList.innerHTML = '';

        // Render todos or empty state
        if (todos.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            todos.forEach(todo => {
                this.todoList.appendChild(this.createTodoElement(todo));
            });
        }

        // Update stats
        this.updateStats();
    }

    /**
     * Create todo element
     * @param {Object} todo - Todo object
     * @returns {HTMLElement} Todo element
     */
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item priority-${todo.priority}`;
        if (todo.completed) div.classList.add('completed');
        div.id = `todo-${todo.id}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.onToggleTodo(todo.id));

        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const meta = document.createElement('div');
        meta.className = 'todo-meta';

        const date = document.createElement('div');
        date.className = 'todo-date';
        date.innerHTML = `<i class="fas fa-calendar"></i> ${todoManager.formatDate(todo.createdAt)}`;

        const priority = document.createElement('span');
        priority.className = `todo-priority priority-${todo.priority}`;
        priority.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

        meta.appendChild(date);
        meta.appendChild(priority);

        content.appendChild(text);
        content.appendChild(meta);

        if (todo.notes) {
            const notes = document.createElement('div');
            notes.className = 'todo-notes';
            notes.innerHTML = `<i class="fas fa-sticky-note"></i> ${this.escapeHtml(todo.notes)}`;
            content.appendChild(notes);
        }

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'todo-btn todo-btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit task';
        editBtn.addEventListener('click', () => this.onEditTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-btn todo-btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', () => this.onDeleteTodo(todo.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(checkbox);
        div.appendChild(content);
        div.appendChild(actions);

        return div;
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = todoManager.getStats();
        this.totalCount.textContent = stats.total;
        this.activeCount.textContent = stats.active;
        this.completedCount.textContent = stats.completed;
    }

    /**
     * Handle add todo
     */
    onAddTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            alert('Please enter a task description');
            return;
        }

        try {
            todoManager.createTodo(text);
            this.todoInput.value = '';
            this.todoInput.focus();
            this.render();
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Handle toggle todo
     * @param {string} id - Todo ID
     */
    onToggleTodo(id) {
        todoManager.toggleTodo(id);
        this.render();
    }

    /**
     * Handle delete todo
     * @param {string} id - Todo ID
     */
    onDeleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            todoManager.deleteTodo(id);
            this.render();
        }
    }

    /**
     * Handle edit todo
     * @param {string} id - Todo ID
     */
    onEditTodo(id) {
        const todo = todoManager.getTodo(id);
        if (!todo) return;

        todoManager.editingId = id;
        this.editInput.value = todo.text;
        this.editPriority.value = todo.priority;
        this.editNotes.value = todo.notes;
        this.editModal.classList.add('show');
        this.editInput.focus();
    }

    /**
     * Handle save edit
     */
    onSaveEdit() {
        const id = todoManager.editingId;
        const text = this.editInput.value.trim();
        const priority = this.editPriority.value;
        const notes = this.editNotes.value.trim();

        if (!text) {
            alert('Task description cannot be empty');
            return;
        }

        todoManager.updateTodo(id, { text, priority, notes });
        this.closeEditModal();
        this.render();
    }

    /**
     * Close edit modal
     */
    closeEditModal() {
        this.editModal.classList.remove('show');
        todoManager.editingId = null;
    }

    /**
     * Handle filter change
     * @param {string} filter - Filter type
     */
    onFilterChange(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        this.render();
    }

    /**
     * Handle sort change
     * @param {string} sortBy - Sort criteria
     */
    onSortChange(sortBy) {
        this.currentSort = sortBy;
        const settings = storage.getSettings();
        settings.sortBy = sortBy;
        storage.saveSettings(settings);
        this.render();
    }

    /**
     * Handle search
     * @param {string} query - Search query
     */
    onSearch(query) {
        this.searchQuery = query;
        this.render();
    }

    /**
     * Handle theme toggle
     */
    onThemeToggle() {
        const isDark = document.body.classList.toggle('dark-mode');
        const settings = storage.getSettings();
        settings.darkMode = isDark;
        storage.saveSettings(settings);
    }

    /**
     * Handle clear completed
     */
    onClearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            todoManager.clearCompleted();
            this.render();
        }
    }

    /**
     * Handle export
     */
    onExport() {
        const data = todoManager.exportTodos();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Handle import
     */
    onImport() {
        this.fileInput.click();
    }

    /**
     * Handle file import
     * @param {Event} event - File input event
     */
    onFileSelected(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (todoManager.importTodos(content)) {
                alert('Todos imported successfully!');
                this.render();
            } else {
                alert('Failed to import todos. Invalid file format.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    /**
     * Handle reset
     */
    onReset() {
        if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
            todoManager.deleteAll();
            this.render();
        }
    }

    /**
     * Load settings
     */
    loadSettings() {
        const settings = storage.getSettings();
        
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        this.currentSort = settings.sortBy || 'date-desc';
        this.sortSelect.value = this.currentSort;
        
        this.currentFilter = settings.filterBy || 'all';
    }

    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
const uiManager = new UIManager();
