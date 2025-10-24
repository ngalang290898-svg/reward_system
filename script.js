// Jungle × Magical Rewards System - Frontend
// API URL - WITH CORS PROXY FIX
const API_URL = 'https://script.google.com/macros/s/AKfycbwfDfRT9uq-IobDQQWeIDfinjnCJ0LIC1zKvt6iWCRL3kid9mZtgL5aFAhDj486Tj8E/exec';

// Application State
const APP_STATE = {
    currentUser: null,
    isAdmin: false,
    currentClass: '4 Pearl',
    authToken: null,
    currentView: 'visitor',
    groupsData: {}
};

// Enhanced Malaysian Name Display - Shows 2-3 names
function getDisplayName(malaysianName) {
    if (!malaysianName) return '';
    
    // Remove common suffixes and prefixes
    const name = malaysianName
        .replace(/BIN\s+/i, '')
        .replace(/BINTI\s+/i, '')
        .replace(/BINTE\s+/i, '')
        .replace(/ANAK\s+/i, '')
        .trim();
    
    // Take first 2-3 words for better identification
    const words = name.split(' ');
    if (words.length >= 3) {
        return words.slice(0, 3).join(' '); // First 3 names
    } else if (words.length === 2) {
        return words.join(' '); // Both names
    } else {
        return words[0]; // Single name
    }
}

// API Communication Functions - WITH CORS PROXY FIX
async function callAPI(params = {}) {
    try {
        const urlParams = new URLSearchParams(params);
        
        // CORS PROXY FIX - Bypass Google Apps Script CORS restrictions
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(`${API_URL}?${urlParams}`);
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Call failed:', error);
        showToast('Failed to connect to jungle API', 'error');
        return { success: false, error: error.message };
    }
}

async function loadDashboardData(className = APP_STATE.currentClass) {
    showToast('Loading jungle data...', 'info');
    
    const result = await callAPI({
        action: 'getGroups',
        class: className
    });
    
    if (result.success) {
        APP_STATE.groupsData = result.data;
        renderDashboard(className);
        updateLastUpdated();
        showToast('Jungle data loaded successfully!', 'success');
    } else {
        showToast('Failed to load data: ' + (result.error || 'Unknown error'), 'error');
    }
}

async function verifyAdminPassword(password) {
    const result = await callAPI({
        action: 'verifyAdmin',
        password: password
    });
    
    return result;
}

async function getAuthToken(password) {
    const result = await callAPI({
        action: 'getToken',
        password: password
    });
    
    if (result.success) {
        APP_STATE.authToken = result.token;
        localStorage.setItem('jungleAuthToken', result.token);
        localStorage.setItem('jungleTokenTime', Date.now());
    }
    
    return result;
}

async function updateStudentPoints(studentName, pointsChange) {
    if (!APP_STATE.authToken) {
        showLoginModal();
        return { success: false, error: 'Not authenticated' };
    }
    
    const result = await callAPI({
        action: 'updatePoints',
        name: studentName,
        change: pointsChange,
        token: APP_STATE.authToken
    });
    
    if (result.success) {
        showToast(`+${pointsChange} points for ${getDisplayName(studentName)}!`, 'success');
        createParticleEffect();
        loadDashboardData(APP_STATE.currentClass);
    }
    
    return result;
}

async function applyGroupBonus(groupName, className) {
    if (!APP_STATE.authToken) {
        showLoginModal();
        return { success: false, error: 'Not authenticated' };
    }
    
    const result = await callAPI({
        action: 'applyGroupBonus',
        group: groupName,
        class: className,
        token: APP_STATE.authToken
    });
    
    if (result.success) {
        showToast(`+10 team bonus for ${groupName}! 🎉`, 'success');
        createConfettiEffect();
        loadDashboardData(APP_STATE.currentClass);
    }
    
    return result;
}

async function resetAllPoints() {
    if (!APP_STATE.authToken) {
        showLoginModal();
        return { success: false, error: 'Not authenticated' };
    }
    
    if (!confirm('Are you sure you want to reset ALL points to zero? This cannot be undone!')) {
        return;
    }
    
    const result = await callAPI({
        action: 'resetAll',
        token: APP_STATE.authToken
    });
    
    if (result.success) {
        showToast('All points have been reset!', 'success');
        loadDashboardData(APP_STATE.currentClass);
    }
    
    return result;
}

// UI Rendering Functions
function renderDashboard(className) {
    const grid = document.getElementById('groupsGrid');
    if (!grid) return;
    
    const classData = APP_STATE.groupsData[className];
    if (!classData) {
        grid.innerHTML = '<div class="no-data">No jungle tribes found for this class</div>';
        return;
    }
    
    // Flatten groups for sorting
    const allGroups = [];
    for (const level in classData) {
        for (const groupName in classData[level]) {
            allGroups.push({
                name: groupName,
                level: level,
                ...classData[level][groupName]
            });
        }
    }
    
    // Sort by total points
    allGroups.sort((a, b) => b.totalPoints - a.totalPoints);
    
    let html = '';
    allGroups.forEach((group, index) => {
        const rank = index + 1;
        const mascot = group.name.split(' ')[0];
        const progress = Math.min((group.totalPoints || 0) % 100, 100);
        
        html += `
            <div class="group-card">
                <div class="group-header">
                    <div class="group-mascot">${mascot}</div>
                    <div class="group-info">
                        <h3 class="group-name">${group.name}</h3>
                        <div class="group-level">${group.level}</div>
                        ${rank <= 3 ? `<div class="group-rank">#${rank}</div>` : ''}
                    </div>
                    <div class="group-points">
                        <div class="points-display">${group.totalPoints}</div>
                        <div class="points-label">Crystals</div>
                    </div>
                </div>
                
                <div class="group-members-preview">
                    <h4>Top Adventurers</h4>
                    <div class="members-list">
                        ${group.members
                            .sort((a, b) => b.points - a.points)
                            .slice(0, 3)
                            .map(member => `
                                <div class="member-preview">
                                    <span class="member-name">${getDisplayName(member.name)}</span>
                                    <span class="member-points">${member.points} ✨</span>
                                </div>
                            `).join('')}
                    </div>
                </div>
                
                <div class="group-actions">
                    <button class="btn-outline" onclick="openGroupModal('${group.name}', '${className}')">View Tribe</button>
                    ${APP_STATE.isAdmin ? `
                        <button class="btn-primary" onclick="applyGroupBonus('${group.name}', '${className}')">Team Bonus +10</button>
                    ` : ''}
                </div>
                
                <div class="group-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${group.totalPoints} crystals collected</div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function openGroupModal(groupName, className) {
    const classData = APP_STATE.groupsData[className];
    if (!classData) return;
    
    // Find the group
    let targetGroup = null;
    for (const level in classData) {
        if (classData[level][groupName]) {
            targetGroup = {
                name: groupName,
                level: level,
                mascot: groupName.split(' ')[0],
                ...classData[level][groupName]
            };
            break;
        }
    }
    
    if (!targetGroup) return;
    
    const modal = document.getElementById('groupModal');
    const content = document.getElementById('modalGroupContent');
    const groupNameElement = document.getElementById('modalGroupName');
    
    const membersHtml = targetGroup.members
        .sort((a, b) => b.points - a.points)
        .map(member => `
            <div class="member-row">
                <div class="member-info">
                    <span class="member-name" title="${member.name}">${getDisplayName(member.name)}</span>
                    <span class="member-points">${member.points} ✨</span>
                </div>
                ${APP_STATE.isAdmin ? `
                    <div class="member-actions">
                        <button class="btn-points" onclick="updateStudentPoints('${member.name}', 10)">+10</button>
                        <button class="btn-points" onclick="updateStudentPoints('${member.name}', 5)">+5</button>
                        <button class="btn-points" onclick="updateStudentPoints('${member.name}', 1)">+1</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    
    content.innerHTML = `
        <div class="group-modal-content">
            <div class="group-modal-header">
                <div class="modal-mascot">${targetGroup.mascot}</div>
                <div class="modal-group-info">
                    <h3>${targetGroup.name}</h3>
                    <p>${targetGroup.level} • ${targetGroup.totalPoints} Total Crystals</p>
                </div>
            </div>
            <div class="members-full-list">
                <h4>Tribe Members</h4>
                <div class="members-table">${membersHtml}</div>
            </div>
        </div>
    `;
    
    groupNameElement.textContent = targetGroup.name;
    modal.classList.remove('hidden');
}

// View Management
function switchView(viewType) {
    APP_STATE.currentView = viewType;
    
    // Update view toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewType);
    });
    
    if (viewType === 'teacher') {
        showLoginModal();
    } else {
        APP_STATE.isAdmin = false;
        APP_STATE.authToken = null;
        updateUIForAuth();
        loadDashboardData();
        showToast('Now in Visitor View', 'info');
    }
}

function updateUIForAuth() {
    const adminElements = document.querySelectorAll('.admin-only');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (APP_STATE.isAdmin) {
        adminElements.forEach(el => el.style.display = 'block');
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.querySelector('.user-email').textContent = "Teacher";
        }
    } else {
        adminElements.forEach(el => el.style.display = 'none');
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Modal Management
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    const passwordInput = document.getElementById('adminPassword');
    const submitBtn = document.getElementById('submitLogin');
    
    modal.classList.remove('hidden');
    passwordInput.value = '';
    
    const loginHandler = async () => {
        const password = passwordInput.value;
        if (!password) {
            showToast('Please enter the magical password', 'error');
            return;
        }
        
        const tokenResult = await getAuthToken(password);
        if (tokenResult.success) {
            APP_STATE.isAdmin = true;
            updateUIForAuth();
            modal.classList.add('hidden');
            showToast('Magical teacher access granted! 🔐', 'success');
            loadDashboardData(APP_STATE.currentClass);
            
            // Update view toggle
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'teacher');
            });
        } else {
            showToast('Incorrect magical password!', 'error');
        }
    };
    
    submitBtn.onclick = loginHandler;
    passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') loginHandler();
    };
    
    // Close handlers
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    };
    
    passwordInput.focus();
}

// Page Navigation
function switchPage(pageName) {
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) link.classList.add('active');
    });
    
    // Show page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) targetPage.classList.add('active');
    
    if (pageName === 'dashboard') {
        loadDashboardData(APP_STATE.currentClass);
    } else if (pageName === 'admin') {
        updateSystemStats();
    }
}

function updateSystemStats() {
    const statsElement = document.getElementById('systemStats');
    if (!statsElement) return;
    
    let totalStudents = 0;
    let totalPoints = 0;
    
    for (const className in APP_STATE.groupsData) {
        for (const level in APP_STATE.groupsData[className]) {
            for (const groupName in APP_STATE.groupsData[className][level]) {
                const group = APP_STATE.groupsData[className][level][groupName];
                totalStudents += group.members.length;
                totalPoints += group.totalPoints;
            }
        }
    }
    
    statsElement.innerHTML = `
        <div>Total Students: ${totalStudents}</div>
        <div>Total Points Awarded: ${totalPoints}</div>
        <div>Classes: ${Object.keys(APP_STATE.groupsData).length}</div>
        <div>Last Updated: ${new Date().toLocaleString()}</div>
    `;
}

// Utility Functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const app = document.getElementById('app');
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    if (app) app.classList.add('hidden');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const app = document.getElementById('app');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (app) app.classList.remove('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4000);
}

function updateLastUpdated() {
    const element = document.getElementById('lastUpdated');
    if (element) {
        element.textContent = 'Updated: ' + new Date().toLocaleTimeString();
    }
}

function createParticleEffect() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle crystal';
        particle.style.left = Math.random() * 100 + 'vw';
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 1500);
    }
}

function createConfettiEffect() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#9D4EDD'][Math.floor(Math.random() * 5)];
        container.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
        }, 2000);
    }
}

function exportData() {
    showToast('Export feature coming soon!', 'info');
}

// Check for stored authentication token
function checkStoredAuth() {
    const storedToken = localStorage.getItem('jungleAuthToken');
    const tokenTime = localStorage.getItem('jungleTokenTime');
    
    if (storedToken && tokenTime) {
        const tokenAge = Date.now() - parseInt(tokenTime);
        const oneHour = 3600000; // 1 hour in milliseconds
        
        if (tokenAge < oneHour) {
            APP_STATE.authToken = storedToken;
            APP_STATE.isAdmin = true;
            updateUIForAuth();
        } else {
            // Token expired
            localStorage.removeItem('jungleAuthToken');
            localStorage.removeItem('jungleTokenTime');
        }
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            switchPage(page);
        });
    });
    
    // Class selector
    const classSelector = document.getElementById('classSelector');
    if (classSelector) {
        classSelector.addEventListener('change', (e) => {
            APP_STATE.currentClass = e.target.value;
            const display = document.getElementById('currentClassDisplay');
            if (display) display.textContent = APP_STATE.currentClass;
            loadDashboardData(APP_STATE.currentClass);
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData(APP_STATE.currentClass);
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            APP_STATE.isAdmin = false;
            APP_STATE.authToken = null;
            localStorage.removeItem('jungleAuthToken');
            localStorage.removeItem('jungleTokenTime');
            updateUIForAuth();
            loadDashboardData();
            showToast('Logged out successfully', 'info');
        });
    }
    
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchView(e.target.dataset.view);
        });
    });
    
    // Reset all points button
    const resetBtn = document.getElementById('resetAllPoints');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllPoints);
    }
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
    
    // Close modals by clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Hero CTA buttons
    document.querySelectorAll('.hero-cta[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            switchPage(page);
        });
    });
}

// Initialize Application
async function initializeApp() {
    showLoadingScreen();
    
    // Check for stored authentication
    checkStoredAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update UI based on auth state
    updateUIForAuth();
    
    // Load initial data
    await loadDashboardData(APP_STATE.currentClass);
    
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
        showToast('Welcome to the enchanted jungle! 🌿✨', 'success');
    }, 2000);
}

// Make functions global
window.openGroupModal = openGroupModal;
window.updateStudentPoints = updateStudentPoints;
window.applyGroupBonus = applyGroupBonus;
window.showLoginModal = showLoginModal;
window.switchView = switchView;
window.exportData = exportData;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Safety timeout
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    const app = document.getElementById('app');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        hideLoadingScreen();
        showToast('Jungle adventure loaded! 🌟', 'success');
    }
}, 10000);
