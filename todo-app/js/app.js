/**
 * Main App
 * Entry point and event listeners
 */

class App {
    constructor() {
        this.init();
    }

    /**
     * Initialize app
     */
    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.render();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Input events
        uiManager.addBtn.addEventListener('click', () => uiManager.onAddTodo());
        uiManager.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') uiManager.onAddTodo();
        });
        uiManager.clearAllBtn.addEventListener('click', () => uiManager.onClearCompleted());

        // Filter events
        uiManager.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                uiManager.onFilterChange(btn.dataset.filter);
            });
        });

        // Sort event
        uiManager.sortSelect.addEventListener('change', (e) => {
            uiManager.onSortChange(e.target.value);
        });

        // Search event
        uiManager.searchInput.addEventListener('input', (e) => {
            uiManager.onSearch(e.target.value);
        });

        // Theme toggle
        uiManager.themeToggle.addEventListener('click', () => {
            uiManager.onThemeToggle();
        });

        // Modal events
        uiManager.closeModal.addEventListener('click', () => {
            uiManager.closeEditModal();
        });
        uiManager.cancelEdit.addEventListener('click', () => {
            uiManager.closeEditModal();
        });
        uiManager.saveEdit.addEventListener('click', () => {
            uiManager.onSaveEdit();
        });
        uiManager.editModal.addEventListener('click', (e) => {
            if (e.target === uiManager.editModal) {
                uiManager.closeEditModal();
            }
        });

        // Footer events
        uiManager.exportBtn.addEventListener('click', () => uiManager.onExport());
        uiManager.importBtn.addEventListener('click', () => uiManager.onImport());
        uiManager.resetBtn.addEventListener('click', () => uiManager.onReset());
        uiManager.fileInput.addEventListener('change', (e) => uiManager.onFileSelected(e));
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        uiManager.loadSettings();
    }

    /**
     * Render UI
     */
    render() {
        uiManager.render();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}
