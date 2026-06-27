/**
 * script.js
 * Frontend logic for FastAPI CRUD Dashboard
 */

const API_URL = 'http://localhost:8000/users'; // Adjust if backend runs on a different port/host

// State
let allUsers = [];

// DOM Elements
const usersTableBody = document.getElementById('users-table-body');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const totalUsersEl = document.getElementById('total-users');
const averageAgeEl = document.getElementById('average-age');

// Forms
const createUserForm = document.getElementById('create-user-form');
const editUserForm = document.getElementById('edit-user-form');
const searchInput = document.getElementById('search-input');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const editIdInput = document.getElementById('edit-id');
const editNameInput = document.getElementById('edit-name');
const editEmailInput = document.getElementById('edit-email');
const editAgeInput = document.getElementById('edit-age');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    // Event Listeners
    createUserForm.addEventListener('submit', handleCreateUser);
    editUserForm.addEventListener('submit', handleUpdateUser);
    searchInput.addEventListener('input', searchUsers);
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeEditModal);
    });
});

/**
 * Fetch all users and render the table
 */
async function loadUsers() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        
        allUsers = await response.json();
        renderTable(allUsers);
        updateStats(allUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('API Error', 'Failed to load users from the server.', 'error');
        renderTable([]); // Show empty state
    } finally {
        showLoading(false);
    }
}

/**
 * Render the user table rows
 */
function renderTable(users) {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        // Use user.id for standard CRUD, fallback to index if missing (depending on backend implementation)
        const id = user.id !== undefined ? user.id : user._id || '-';
        
        tr.innerHTML = `
            <td>#${id}</td>
            <td class="font-medium">${escapeHTML(user.name)}</td>
            <td class="text-muted">${escapeHTML(user.email)}</td>
            <td>${user.age}</td>
            <td class="actions-cell">
                <button class="icon-btn edit" onclick="openEditModal('${id}', '${escapeHTML(user.name)}', '${escapeHTML(user.email)}', ${user.age})" title="Edit User">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="icon-btn delete" onclick="confirmDeleteUser('${id}')" title="Delete User">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        usersTableBody.appendChild(tr);
    });
}

/**
 * Handle user creation form submission
 */
async function handleCreateUser(e) {
    e.preventDefault();
    
    const name = document.getElementById('create-name').value.trim();
    const email = document.getElementById('create-email').value.trim();
    const age = parseInt(document.getElementById('create-age').value, 10);
    
    // Validation
    if (!name || !email || isNaN(age)) {
        showToast('Validation Error', 'All fields are required.', 'error');
        return;
    }
    
    if (age <= 0) {
        showToast('Validation Error', 'Age must be a positive number.', 'error');
        return;
    }
    
    const userData = { name, email, age };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to create user');
        
        // Success
        createUserForm.reset();
        showToast('Success', 'User created successfully.', 'success');
        loadUsers(); // Refresh table
    } catch (error) {
        console.error('Error creating user:', error);
        showToast('API Error', 'Failed to create user. Please try again.', 'error');
    }
}

/**
 * Handle updating a user
 */
async function handleUpdateUser(e) {
    e.preventDefault();
    
    const id = editIdInput.value;
    const name = editNameInput.value.trim();
    const email = editEmailInput.value.trim();
    const age = parseInt(editAgeInput.value, 10);
    
    // Validation
    if (!name || !email || isNaN(age)) {
        showToast('Validation Error', 'All fields are required.', 'error');
        return;
    }
    
    if (age <= 0) {
        showToast('Validation Error', 'Age must be a positive number.', 'error');
        return;
    }
    
    const userData = { name, email, age };
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to update user');
        
        // Success
        closeEditModal();
        showToast('Success', 'User updated successfully.', 'success');
        loadUsers(); // Refresh table
    } catch (error) {
        console.error('Error updating user:', error);
        showToast('API Error', 'Failed to update user.', 'error');
    }
}

/**
 * Confirm and delete a user
 */
function confirmDeleteUser(id) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        deleteUser(id);
    }
}

/**
 * Execute delete user API call
 */
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        showToast('Success', 'User deleted successfully.', 'success');
        loadUsers(); // Refresh table
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('API Error', 'Failed to delete user.', 'error');
    }
}

/**
 * Filter users based on search input
 */
function searchUsers() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        renderTable(allUsers);
        return;
    }
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
    );
    
    renderTable(filteredUsers);
}

/**
 * Update stats cards
 */
function updateStats(users) {
    totalUsersEl.textContent = users.length;
    
    if (users.length === 0) {
        averageAgeEl.textContent = '0';
        return;
    }
    
    const totalAge = users.reduce((sum, user) => sum + user.age, 0);
    const avgAge = Math.round(totalAge / users.length);
    averageAgeEl.textContent = avgAge;
}

/**
 * Open the edit modal with prefilled data
 */
window.openEditModal = function(id, name, email, age) {
    editIdInput.value = id;
    editNameInput.value = name;
    editEmailInput.value = email;
    editAgeInput.value = age;
    
    editModal.classList.remove('hidden');
}

/**
 * Close the edit modal
 */
function closeEditModal() {
    editModal.classList.add('hidden');
    editUserForm.reset();
}

/**
 * Show animated toast notification
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    // Determine icon based on type
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-xmark';
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300); // Wait for transition to finish
    }, 3000);
}

/**
 * Toggle loading state
 */
function showLoading(isLoading) {
    if (isLoading) {
        loadingState.classList.remove('hidden');
        emptyState.classList.add('hidden');
        usersTableBody.innerHTML = '';
    } else {
        loadingState.classList.add('hidden');
    }
}

/**
 * Utility: Escape HTML to prevent XSS
 */
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
