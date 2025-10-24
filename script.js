// 🌟 Jungle × Magical - Premium Frontend
// API URL - Update with your deployed web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwfDfRT9uq-IobDQQWeIDfinjnCJ0LIC1zKvt6iWCRL3kid9mZtgL5aFAhDj486Tj8E/exec';

// Premium Application State
const APP_STATE = {
    currentUser: null,
    isAdmin: false,
    currentClass: '4 Pearl',
    authToken: null,
    currentView: 'visitor',
    groupsData: {},
    premiumFeatures: true
};

// Enhanced Malaysian Name Display
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
        return words.slice(0, 3).join(' ');
    } else if (words.length === 2) {
        return words.join(' ');
    } else {
        return words[0];
    }
}

// Premium API Communication
async function callAPI(params = {}) {
    try {
        const urlParams = new URLSearchParams(params);
        const response = await fetch(`${API_URL}?${urlParams}`, {
            method: 'GET',
            mode: 'no-cors'
        });
        
        console.log('API Request sent to:', `${API_URL}?${urlParams}`);
        
        // For development, return mock data
        return getPremiumMockData(params.action, params);
        
    } catch (error) {
        console.error('API Call failed:', error);
        return getPremiumMockData(params.action, params);
    }
}

// Enhanced Mock Data for Premium Experience
function getPremiumMockData(action, params) {
    const mockGroups = {
        "4 Pearl": {
            "Pre-A1": {
                "🐯 The Mighty Tigers — Group T1": {
                    totalPoints: 156,
                    members: [
                        { name: "ADELLA KAISARA BINTI AMDAN", points: 45 },
                        { name: "AHMAD JIHAD BIN ABDULLAH", points: 38 },
                        { name: "ANJENNY PAILEE", points: 52 },
                        { name: "AZIZAH ALISHA BINTI AZMIZAN AZRIN", points: 21 }
                    ]
                },
                "🐯 The Mighty Tigers — Group T2": {
                    totalPoints: 128,
                    members: [
                        { name: "FAREL BIN ARSID", points: 35 },
                        { name: "INDRA PUTRA BIN JAINI", points: 42 },
                        { name: "MOHAMAD NUR ZAQIF ZIQRI BIN MOHAMAD TINO", points: 28 },
                        { name: "MUHAMMAD DANISH IFWAT BIN MUHAMMAD IFFAD", points: 23 }
                    ]
                }
            },
            "Low A1": {
                "🦊 The Clever Foxes — Foxes F1": {
                    totalPoints: 189,
                    members: [
                        { name: "NOOR QASEH NADIA BINTI ABDULLAH", points: 65 },
                        { name: "MUHAMMAD NAZRIN BIN ZULLASRI", points: 58 },
                        { name: "NURUL ALISA SAPPIKA BINTI ABDULLAH", points: 42 },
                        { name: "PUTERI MYA ARLISSA BINTI MOHD BAKRI", points: 24 }
                    ]
                }
            }
        },
        "4 Crystal": {
            "Pre-A1": {
                "🐒 The Playful Monkeys — Monkeys A": {
                    totalPoints: 142,
                    members: [
                        { name: "ASHIRAH BINTI ASIS", points: 38 },
                        { name: "AIDIL FAZLI BIN ABDULLAH", points: 45 },
                        { name: "AL SYAMIR BIN ABDUL NASIR", points: 32 },
                        { name: "ELYANA BINTI MARTIN", points: 27 }
                    ]
                },
                "🦁 The Glorious Lions — Lions A": {
                    totalPoints: 201,
                    members: [
                        { name: "NURAZLIYANAH BATRISAH BINTI SABRI", points: 68 },
                        { name: "MOHAMAD RIZANI SYAHIZIEY BIN ABDULLAH", points: 55 },
                        { name: "MUHAMMAD HAIZUL BIN OMAR", points: 48 },
                        { name: "MUHAMMAD QAWIEM RAFIQ BIN RAZLAN", points: 30 }
                    ]
                }
            }
        }
    };

    switch(action) {
        case 'getGroups':
            return {
                success: true,
                data: params.class ? { [params.class]: mockGroups[params.class] } : mockGroups,
                premium: true,
                timestamp: new Date().toISOString()
            };
        case 'verifyAdmin':
            return { 
                success: params.password === 'jungle123',
                premium: true 
            };
        case 'getToken':
            if (params.password === 'jungle123') {
                return {
                    success: true,
                    token: 'premium-mock-token-' + Date.now(),
                    expiresIn: 3600,
                    premium: true
                };
            }
            return { success: false, error: 'Invalid password' };
        default:
            return { 
                success: true, 
                message: 'Premium mock response',
                premium: true 
            };
    }
}

// Premium Data Loading
async function loadDashboardData(className = APP_STATE.currentClass) {
    showToast('Loading premium jungle data...', 'info');
    
    const result = await callAPI({
        action: 'getGroups',
        class: className
    });
    
    if (result.success) {
        APP_STATE.groupsData = result.data;
        renderPremiumDashboard(className);
        updateLastUpdated();
        showToast('Premium data loaded successfully! 🌟', 'success');
        createSparkleEffect();
    } else {
        showToast('Failed to load data: ' + (result.error || 'Unknown error'), 'error');
    }
}

// Premium Dashboard Rendering
function renderPremiumDashboard(className) {
    const grid = document.getElementById('groupsGrid');
    if (!grid) return;
    
    const classData = APP_STATE.groupsData[className];
    if (!classData) {
        grid.innerHTML = `
            <div class="no-data">
                <i class="fas fa-search"></i>
                <p>No jungle tribes found for this class</p>
            </div>
        `;
        return;
    }
    
    // Flatten and sort groups
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
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        
        html += `
            <div class="group-card ${rankClass}">
                <div class="group-header">
                    <div class="group-mascot">${mascot}</div>
                    <div class="group-info">
                        <h3 class="group-name">${group.name}</h3>
                        <div class="group-level">${group.level}</div>
                        ${rank <= 3 ? `
                            <div class="group-rank">
                                <i class="fas fa-trophy"></i>
                                #${rank}
                            </div>
                        ` : ''}
                    </div>
                    <div class="group-points">
                        <div class="points-display">${group.totalPoints}</div>
                        <div class="points-label">Crystals</div>
                    </div>
                </div>
                
                <div class="group-members-preview">
                    <h4><i class="fas fa-users"></i> Top Adventurers</h4>
                    <div class="members-list">
                        ${group.members
                            .sort((a, b) => b.points - a.points)
                            .slice(0, 3)
                            .map(member => `
                                <div class="member-preview">
                                    <span class="member-name">${getDisplayName(member.name)}</span>
                                    <span class="member-points">
                                        <i class="fas fa-gem"></i>
                                        ${member.points}
                                    </span>
                                </div>
                            `).join('')}
                    </div>
                </div>
                
                <div class="group-actions">
                    <button class="premium-btn outline" onclick="openGroupModal('${group.name}', '${className}')">
                        <i class="fas fa-eye"></i>
                        View Tribe
                    </button>
                    ${APP_STATE.isAdmin ? `
                        <button class="premium-btn" onclick="applyGroupBonus('${group.name}', '${className}')">
                            <i class="fas fa-star"></i>
                            Team Bonus
                        </button>
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

// Enhanced Group Modal
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
        .map((member, index) => `
            <div class="member-row ${index < 3 ? 'top-member' : ''}">
                <div class="member-rank">
                    ${index < 3 ? `<i class="fas fa-trophy"></i>` : `#${index + 1}`}
                </div>
                <div class="member-info">
                    <span class="member-name" title="${member.name}">${getDisplayName(member.name)}</span>
                    <span class="member-points">
                        <i class="fas fa-gem"></i>
                        ${member.points}
                    </span>
                </div>
                ${APP_STATE.isAdmin ? `
                    <div class="member-actions">
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name}', 10)">
                            <i class="fas fa-plus"></i>
                            10
                        </button>
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name}', 5)">
                            <i class="fas fa-plus"></i>
                            5
                        </button>
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name}', 1)">
                            <i class="fas fa-plus"></i>
                            1
                        </button>
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
                    <p>${targetGroup.level} • ${targetGroup.members.length} Members</p>
                    <div class="group-total-points">
                        <i class="fas fa-gem"></i>
                        ${targetGroup.totalPoints} Total Crystals
                    </div>
                </div>
            </div>
            <div class="members-full-list">
                <h4><i class="fas fa-list-ol"></i> Tribe Members Ranking</h4>
                <div class="members-table">${membersHtml}</div>
            </div>
        </div>
    `;
    
    groupNameElement.innerHTML = `<i class="fas fa-users"></i> ${targetGroup.name}`;
    modal.classList.remove('hidden');
    createSparkleEffect();
}

// Premium Authentication
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
        localStorage.setItem('premiumUser', 'true');
    }
    
    return result;
}

// Premium Point Management
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
        showToast(`+${pointsChange} crystals for ${getDisplayName(studentName)}! ✨`, 'success');
        createSparkleEffect();
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
        showToast('All points have been reset! 🔄', 'success');
        loadDashboardData(APP_STATE.currentClass);
    }
    
    return result;
}

// Premium UI Management
function switchView(viewType) {
    APP_STATE.currentView = viewType;
    
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
        showToast('Now in Visitor View 👀', 'info');
    }
}

function updateUIForAuth() {
    const adminElements = document.querySelectorAll('.admin-only');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (APP_STATE.isAdmin) {
        adminElements.forEach(el => el.style.display = 'flex');
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.querySelector('.user-name').textContent = "Teacher";
        }
        document.body.classList.add('premium-admin');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
        if (loginBtn) loginBtn.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        document.body.classList.remove('premium-admin');
    }
}

// Premium Modal Management
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
            showToast('Premium teacher access granted! 🔐', 'success');
            loadDashboardData(APP_STATE.currentClass);
            
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'teacher');
            });
            
            createSparkleEffect();
        } else {
            showToast('Incorrect magical password! ❌', 'error');
        }
    };
    
    submitBtn.onclick = loginHandler;
    passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') loginHandler();
    };
    
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    };
    
    passwordInput.focus();
}

// Premium Page Navigation
function switchPage(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) link.classList.add('active');
    });
    
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
    
    createSparkleEffect();
}

function updateSystemStats() {
    const statsElement = document.getElementById('systemStats');
    if (!statsElement) return;
    
    let totalStudents = 0;
    let totalPoints = 0;
    let totalGroups = 0;
    
    for (const className in APP_STATE.groupsData) {
        for (const level in APP_STATE.groupsData[className]) {
            for (const groupName in APP_STATE.groupsData[className][level]) {
                const group = APP_STATE.groupsData[className][level][groupName];
                totalStudents += group.members.length;
                totalPoints += group.totalPoints;
                totalGroups++;
            }
        }
    }
    
    statsElement.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-users"></i>
            <span>Total Students: ${totalStudents}</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-gem"></i>
            <span>Total Crystals: ${totalPoints}</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-layer-group"></i>
            <span>Active Groups: ${totalGroups}</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span>Last Updated: ${new Date().toLocaleString()}</span>
        </div>
    `;
}

// Premium Utility Functions
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
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
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

function createSparkleEffect() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        container.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
        }, 1000);
    }
}

function createConfettiEffect() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
        }, 3000);
    }
}

// Check for stored authentication
function checkStoredAuth() {
    const storedToken = localStorage.getItem('jungleAuthToken');
    const tokenTime = localStorage.getItem('jungleTokenTime');
    const isPremium = localStorage.getItem('premiumUser');
    
    if (storedToken && tokenTime && isPremium) {
        const tokenAge = Date.now() - parseInt(tokenTime);
        const oneHour = 3600000;
        
        if (tokenAge < oneHour) {
            APP_STATE.authToken = storedToken;
            APP_STATE.isAdmin = true;
            updateUIForAuth();
        } else {
            localStorage.removeItem('jungleAuthToken');
            localStorage.removeItem('jungleTokenTime');
            localStorage.removeItem('premiumUser');
        }
    }
}

// Premium Event Listeners
function setupPremiumEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            switchPage(page);
        });
    });
    
    // Class selector
    const classSelector = document.getElementById('classSelector');
    if (classSelector) {
        classSelector.addEventListener('change', (e) => {
            APP_STATE.currentClass = e.target.value;
            const display = document.getElementById('currentClassDisplay');
            if (display) display.innerHTML = `<i class="fas fa-graduation-cap"></i> ${APP_STATE.currentClass}`;
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
            localStorage.removeItem('premiumUser');
            updateUIForAuth();
            loadDashboardData();
            showToast('Logged out successfully 👋', 'info');
        });
    }
    
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchView(e.currentTarget.dataset.view);
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
            const page = e.currentTarget.dataset.page;
            switchPage(page);
        });
    });
}

// Premium Initialization
async function initializePremiumApp() {
    showLoadingScreen();
    
    // Check for stored authentication
    checkStoredAuth();
    
    // Setup event listeners
    setupPremiumEventListeners();
    
    // Update UI based on auth state
    updateUIForAuth();
    
    // Load initial data
    await loadDashboardData(APP_STATE.currentClass);
    
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
        showToast('Welcome to the Premium Jungle Experience! 🌟✨', 'success');
        createSparkleEffect();
    }, 2500);
}

// Make functions global
window.openGroupModal = openGroupModal;
window.updateStudentPoints = updateStudentPoints;
window.applyGroupBonus = applyGroupBonus;
window.showLoginModal = showLoginModal;
window.switchView = switchView;
window.exportData = exportData;
window.showSettings = () => showToast('Settings feature coming soon! ⚙️', 'info');
window.initializePremiumApp = initializePremiumApp;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePremiumApp);

// Additional CSS for premium features
const premiumStyles = `
    .premium-btn.outline {
        background: transparent;
        border: 2px solid var(--primary-light);
        color: var(--primary-light);
    }
    
    .premium-btn.small {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    .group-card.rank-1 {
        border: 2px solid var(--accent);
        box-shadow: var(--glow-accent);
    }
    
    .group-card.rank-2 {
        border: 2px solid var(--primary-light);
        box-shadow: var(--glow-primary);
    }
    
    .group-card.rank-3 {
        border: 2px solid var(--secondary);
        box-shadow: var(--glow-secondary);
    }
    
    .top-member {
        background: rgba(99, 102, 241, 0.1) !important;
    }
    
    .member-rank {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .sparkle {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--gradient-premium);
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        animation: sparkleFloat 1s ease-out forwards;
        pointer-events: none;
        z-index: 100;
    }
    
    .confetti {
        position: fixed;
        width: 15px;
        height: 15px;
        animation: confettiFall 3s ease-in forwards;
        pointer-events: none;
        z-index: 100;
        border-radius: 2px;
    }
    
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0) rotate(180deg);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .premium-admin .main-content {
        background: rgba(99, 102, 241, 0.02);
    }
`;

// Inject premium styles
const styleSheet = document.createElement('style');
styleSheet.textContent = premiumStyles;
document.head.appendChild(styleSheet);

