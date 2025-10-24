// 🌟 PROFESSIONAL Jungle × Magical System - Enhanced JavaScript
// Apple/Google-inspired UX with Samsung/Windows 11 touches

class JungleRewardsSystem {
    constructor() {
        this.currentView = 'visitor';
        this.currentPage = 'home';
        this.currentClass = '4 Pearl';
        this.isAuthenticated = false;
        this.adminToken = null;
        this.groupsData = null;
        this.leaderboardData = null;
        
        this.API_BASE = 'https://script.google.com/macros/s/AKfycbwhtjUWDap-S0t9U93FycOPqQHd5lJWDsVTGIJPZUUeaRQ1gp8pbXlxwbnFjkIWocOg/exec';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeApp();
        this.setupResponsiveHandlers();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // View Toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Class Selectors
        document.getElementById('classSelector').addEventListener('change', (e) => {
            this.currentClass = e.target.value;
            this.updateClassDisplay();
            this.loadDashboardData();
        });

        document.getElementById('leaderboardClassSelector').addEventListener('change', (e) => {
            this.loadLeaderboardData(e.target.value);
        });

        // Tab Buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Authentication
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.getElementById('submitLogin').addEventListener('click', () => {
            this.handleLogin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        // Data Management
        document.getElementById('refreshData').addEventListener('click', () => {
            this.loadDashboardData();
        });

        document.getElementById('resetAllPoints').addEventListener('click', () => {
            this.resetAllPoints();
        });

        // Modal Handling
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Hero CTA Buttons
        document.querySelectorAll('.hero-cta[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    setupResponsiveHandlers() {
        // Handle window resize for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 300);
        });
    }

    handleResize() {
        // Adjust layout elements based on screen size
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }

        // Update any dynamic layout elements
        this.updateResponsiveElements();
    }

    updateResponsiveElements() {
        // Update font sizes or layouts that need dynamic adjustment
        const titleElements = document.querySelectorAll('.hero-title, .page-title');
        titleElements.forEach(title => {
            if (title.scrollWidth > title.clientWidth) {
                title.style.fontSize = 'clamp(1.8rem, 6vw, 3rem)';
            }
        });
    }

    async initializeApp() {
        try {
            // Show loading screen
            this.showLoadingScreen();

            // Simulate loading process
            await this.simulateLoading();
            
            // Initialize data
            await this.loadInitialData();
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            this.showApp();
            
            // Load initial page data
            this.loadDashboardData();
            this.loadLeaderboardData('all');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('Failed to initialize application', 'error');
            this.hideLoadingScreen();
            this.showApp();
        }
    }

    simulateLoading() {
        return new Promise((resolve) => {
            const progressBar = document.querySelector('.progress-fill');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                }
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
            }, 200);
        });
    }

    showLoadingScreen() {
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    showApp() {
        document.getElementById('app').classList.remove('hidden');
        this.createParticles();
    }

    async loadInitialData() {
        try {
            // Load groups data
            const groupsResponse = await this.fetchData('getGroups', { class: this.currentClass });
            if (groupsResponse.success) {
                this.groupsData = groupsResponse.data;
            }

            // Load leaderboard data
            const leaderboardResponse = await this.fetchData('getGroups', { class: 'all' });
            if (leaderboardResponse.success) {
                this.leaderboardData = leaderboardResponse.data;
            }

        } catch (error) {
            console.error('Error loading initial data:', error);
            throw error;
        }
    }

    navigateToPage(page) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // Show target page
        document.getElementById(`${page}Page`).classList.add('active');
        this.currentPage = page;

        // Load page-specific data
        this.loadPageData(page);

        // Close any open modals
        this.closeAllModals();

        // Add page transition effects
        this.animatePageTransition();
    }

    animatePageTransition() {
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            activePage.style.animation = 'none';
            setTimeout(() => {
                activePage.style.animation = 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);
        }
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'leaderboard':
                this.loadLeaderboardData('all');
                break;
            case 'admin':
                if (this.isAuthenticated) {
                    this.loadAdminData();
                }
                break;
        }
    }

    async loadDashboardData() {
        const groupsGrid = document.getElementById('groupsGrid');
        if (!groupsGrid) return;

        // Show loading state
        groupsGrid.innerHTML = `
            <div class="loading-groups">
                <i class="fas fa-spinner"></i>
                <p>Discovering jungle tribes...</p>
            </div>
        `;

        try {
            const response = await this.fetchData('getGroups', { class: this.currentClass });
            
            if (response.success) {
                this.groupsData = response.data;
                this.renderGroupsGrid(response.data);
                this.updateLastUpdated();
            } else {
                throw new Error(response.error || 'Failed to load groups data');
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            groupsGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load groups data</p>
                    <button class="premium-btn small" onclick="app.loadDashboardData()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    renderGroupsGrid(data) {
        const groupsGrid = document.getElementById('groupsGrid');
        if (!groupsGrid) return;

        // Flatten groups data for sorting
        const allGroups = [];
        for (const className in data) {
            for (const level in data[className]) {
                for (const groupName in data[className][level]) {
                    const group = data[className][level][groupName];
                    allGroups.push({
                        className,
                        level,
                        groupName,
                        ...group
                    });
                }
            }
        }

        // Sort groups by points
        allGroups.sort((a, b) => b.totalPoints - a.totalPoints);

        // Render groups
        groupsGrid.innerHTML = allGroups.map((group, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const membersToShow = group.members.slice(0, 3);
            const hasMoreMembers = group.members.length > 3;

            return `
                <div class="group-card ${rankClass}" data-group="${group.groupName}" data-class="${group.className}">
                    <div class="group-header">
                        <div class="group-mascot">
                            ${this.getGroupEmoji(group.groupName)}
                        </div>
                        <div class="group-info">
                            <div class="group-name-row">
                                <h3 class="group-name" title="${group.groupName}">${group.groupName}</h3>
                                <span class="group-rank">
                                    <i class="fas fa-trophy"></i>
                                    #${rank}
                                </span>
                            </div>
                            <div class="group-meta-row">
                                <span class="group-level">${group.level}</span>
                                <span class="group-class">${group.className}</span>
                            </div>
                        </div>
                    </div>

                    <div class="group-points-section">
                        <div class="points-display-container">
                            <div class="points-display" data-points="${group.totalPoints}">
                                ${this.formatPoints(group.totalPoints)}
                            </div>
                            <div class="points-label">Crystals</div>
                        </div>
                        <div class="group-progress">
                            <div class="progress-info">
                                <span class="progress-text">Group Progress</span>
                                <span class="progress-percentage">${Math.round((group.totalPoints / 1000) * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min((group.totalPoints / 1000) * 100, 100)}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="group-members-preview">
                        <h4>
                            <i class="fas fa-users"></i>
                            Tribe Members (${group.members.length})
                        </h4>
                        <div class="members-list">
                            ${membersToShow.map(member => `
                                <div class="member-preview">
                                    <div class="member-info">
                                        <div class="member-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <span class="member-name" title="${member.name}">${this.shortenName(member.name)}</span>
                                    </div>
                                    <span class="member-points">
                                        <i class="fas fa-gem"></i>
                                        ${member.points}
                                    </span>
                                </div>
                            `).join('')}
                            ${hasMoreMembers ? `
                                <div class="more-members" onclick="app.showGroupModal('${group.groupName}', '${group.className}')">
                                    +${group.members.length - 3} more members
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="group-actions">
                        <button class="premium-btn small outline" onclick="app.showGroupModal('${group.groupName}', '${group.className}')">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        ${this.isAuthenticated ? `
                            <button class="premium-btn small" onclick="app.applyGroupBonus('${group.groupName}', '${group.className}')">
                                <i class="fas fa-plus"></i>
                                Add Bonus
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for group cards
        groupsGrid.querySelectorAll('.group-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.premium-btn')) {
                    const groupName = card.getAttribute('data-group');
                    const className = card.getAttribute('data-class');
                    this.showGroupModal(groupName, className);
                }
            });
        });
    }

    async loadLeaderboardData(className) {
        const groupsContent = document.getElementById('groupsLeaderboardContent');
        const individualsContent = document.getElementById('individualsLeaderboardContent');

        // Show loading states
        [groupsContent, individualsContent].forEach(container => {
            if (container) {
                container.innerHTML = `
                    <div class="loading-leaderboard">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading rankings...</p>
                    </div>
                `;
            }
        });

        try {
            const response = await this.fetchData('getGroups', { class: className });
            
            if (response.success) {
                this.leaderboardData = response.data;
                this.renderGroupsLeaderboard(response.data);
                this.renderIndividualsLeaderboard(response.data);
            } else {
                throw new Error(response.error || 'Failed to load leaderboard data');
            }
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            const errorHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load leaderboard data</p>
                    <button class="premium-btn small" onclick="app.loadLeaderboardData('${className}')">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
            
            if (groupsContent) groupsContent.innerHTML = errorHTML;
            if (individualsContent) individualsContent.innerHTML = errorHTML;
        }
    }

    renderGroupsLeaderboard(data) {
        const container = document.getElementById('groupsLeaderboardContent');
        if (!container) return;

        // Flatten and sort groups
        const allGroups = [];
        for (const className in data) {
            for (const level in data[className]) {
                for (const groupName in data[className][level]) {
                    const group = data[className][level][groupName];
                    allGroups.push({
                        className,
                        level,
                        groupName,
                        ...group
                    });
                }
            }
        }

        allGroups.sort((a, b) => b.totalPoints - a.totalPoints);

        if (allGroups.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users-slash"></i>
                    <p>No groups found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="leaderboard-header">
                <div>Rank</div>
                <div>Group</div>
                <div>Points</div>
            </div>
            <div class="leaderboard-list">
                ${allGroups.map((group, index) => {
                    const rank = index + 1;
                    const rankClass = rank <= 3 ? `rank-${rank}` : '';
                    
                    return `
                        <div class="leaderboard-item ${rankClass}" onclick="app.showGroupModal('${group.groupName}', '${group.className}')">
                            <div class="rank">
                                ${rank <= 3 ? `
                                    <div class="rank-medal">
                                        <i class="fas fa-medal"></i>
                                        ${rank}
                                    </div>
                                ` : `
                                    <div class="rank-number">${rank}</div>
                                `}
                            </div>
                            <div class="group-info">
                                <div class="group-mascot">
                                    ${this.getGroupEmoji(group.groupName)}
                                </div>
                                <div class="group-details">
                                    <div class="group-name">${group.groupName}</div>
                                    <div class="group-meta">${group.level} • ${group.className}</div>
                                </div>
                            </div>
                            <div class="points">
                                <div class="points-badge">
                                    <i class="fas fa-gem"></i>
                                    ${this.formatPoints(group.totalPoints)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderIndividualsLeaderboard(data) {
        const container = document.getElementById('individualsLeaderboardContent');
        if (!container) return;

        // Flatten all students
        const allStudents = [];
        for (const className in data) {
            for (const level in data[className]) {
                for (const groupName in data[className][level]) {
                    const group = data[className][level][groupName];
                    group.members.forEach(member => {
                        allStudents.push({
                            className,
                            level,
                            groupName,
                            ...member
                        });
                    });
                }
            }
        }

        // Sort students by points
        allStudents.sort((a, b) => b.points - a.points);

        if (allStudents.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-user-slash"></i>
                    <p>No students found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="leaderboard-header">
                <div>Rank</div>
                <div>Student</div>
                <div>Points</div>
            </div>
            <div class="leaderboard-list">
                ${allStudents.map((student, index) => {
                    const rank = index + 1;
                    const rankClass = rank <= 3 ? `rank-${rank}` : '';
                    
                    return `
                        <div class="leaderboard-item ${rankClass}">
                            <div class="rank">
                                ${rank <= 3 ? `
                                    <div class="rank-medal">
                                        <i class="fas fa-medal"></i>
                                        ${rank}
                                    </div>
                                ` : `
                                    <div class="rank-number">${rank}</div>
                                `}
                            </div>
                            <div class="student-info">
                                <div class="student-avatar">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div class="student-details">
                                    <div class="student-name">${this.shortenName(student.name)}</div>
                                    <div class="student-meta">${student.groupName} • ${student.className}</div>
                                </div>
                            </div>
                            <div class="points">
                                <div class="points-badge">
                                    <i class="fas fa-gem"></i>
                                    ${student.points}
                                </div>
                            </div>
                        </div>
                    `;
                }).slice(0, 50).join('')} <!-- Limit to top 50 -->
            </div>
        `;
    }

    async showGroupModal(groupName, className) {
        if (!this.groupsData || !this.groupsData[className]) {
            this.showToast('Group data not available', 'error');
            return;
        }

        const modal = document.getElementById('groupModal');
        const modalName = document.getElementById('modalGroupName');
        const modalContent = document.getElementById('modalGroupContent');

        // Show loading state
        modalContent.innerHTML = `
            <div class="loading-groups">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading group details...</p>
            </div>
        `;

        // Find group data
        let groupData = null;
        for (const level in this.groupsData[className]) {
            if (this.groupsData[className][level][groupName]) {
                groupData = {
                    level,
                    groupName,
                    className,
                    ...this.groupsData[className][level][groupName]
                };
                break;
            }
        }

        if (!groupData) {
            modalContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Group not found</p>
                </div>
            `;
            this.showModal(modal);
            return;
        }

        // Sort members by points
        groupData.members.sort((a, b) => b.points - a.points);

        // Render modal content
        modalName.innerHTML = `
            <i class="fas fa-users"></i>
            ${groupData.groupName}
        `;

        modalContent.innerHTML = `
            <div class="group-modal-content">
                <div class="group-modal-header">
                    <div class="modal-mascot">
                        ${this.getGroupEmoji(groupData.groupName)}
                    </div>
                    <div class="modal-group-info">
                        <h3>${groupData.groupName}</h3>
                        <p>${groupData.level} • ${groupData.className}</p>
                        <div class="group-total-points">
                            <i class="fas fa-gem"></i>
                            Total: ${this.formatPoints(groupData.totalPoints)} Crystals
                        </div>
                    </div>
                </div>

                <div class="members-full-list">
                    <h4>
                        <i class="fas fa-users"></i>
                        Tribe Members (${groupData.members.length})
                    </h4>
                    <div class="members-table">
                        ${groupData.members.map((member, index) => {
                            const isTopMember = index < 3;
                            return `
                                <div class="member-row ${isTopMember ? 'top-member' : ''}">
                                    <div class="member-rank">${index + 1}</div>
                                    <div class="member-info">
                                        <span class="member-name">${member.name}</span>
                                        <span class="member-class">${groupData.className}</span>
                                    </div>
                                    <div class="member-points">
                                        <i class="fas fa-gem"></i>
                                        ${member.points}
                                    </div>
                                    ${this.isAuthenticated ? `
                                        <div class="member-actions">
                                            <button class="premium-btn small" onclick="app.updateStudentPoints('${member.name}', 5)">
                                                +5
                                            </button>
                                            <button class="premium-btn small outline" onclick="app.updateStudentPoints('${member.name}', -5)">
                                                -5
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                ${this.isAuthenticated ? `
                    <div class="group-actions" style="margin-top: 2rem;">
                        <button class="premium-btn" onclick="app.applyGroupBonus('${groupData.groupName}', '${groupData.className}')">
                            <i class="fas fa-plus"></i>
                            Add Group Bonus (+10 each)
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        this.showModal(modal);
    }

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Show/hide admin elements
        const adminElements = document.querySelectorAll('.admin-only');
        if (view === 'teacher') {
            this.showLoginModal();
        } else {
            adminElements.forEach(el => el.style.display = 'none');
            if (this.isAuthenticated) {
                this.handleLogout();
            }
        }

        // Update UI based on view
        this.updateUIForView();
    }

    updateUIForView() {
        const body = document.body;
        if (this.currentView === 'teacher' && this.isAuthenticated) {
            body.classList.add('premium-admin');
        } else {
            body.classList.remove('premium-admin');
        }
    }

    async showLoginModal() {
        if (this.isAuthenticated) {
            this.showToast('Already logged in', 'info');
            return;
        }

        const modal = document.getElementById('loginModal');
        document.getElementById('adminPassword').value = '';
        this.showModal(modal);
    }

    async handleLogin() {
        const password = document.getElementById('adminPassword').value;
        const submitBtn = document.getElementById('submitLogin');

        if (!password) {
            this.showToast('Please enter password', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitBtn.disabled = true;

        try {
            const response = await this.fetchData('getToken', { password });

            if (response.success) {
                this.isAuthenticated = true;
                this.adminToken = response.token;
                
                // Show admin elements
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'flex';
                });
                
                this.closeAllModals();
                this.showToast('Successfully logged in!', 'success');
                this.updateUIForView();
                
                // Load admin data if on admin page
                if (this.currentPage === 'admin') {
                    this.loadAdminData();
                }
                
            } else {
                throw new Error(response.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Invalid password', 'error');
            this.createParticles('error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.adminToken = null;
        
        // Hide admin elements
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Switch to visitor view if in teacher view
        if (this.currentView === 'teacher') {
            this.switchView('visitor');
        }
        
        this.showToast('Logged out successfully', 'info');
        this.updateUIForView();
    }

    async loadAdminData() {
        if (!this.isAuthenticated) return;

        try {
            const [systemResponse, activityResponse] = await Promise.all([
                this.fetchData('getData'),
                this.fetchData('getGroups', { class: 'all' })
            ]);

            if (systemResponse.success && activityResponse.success) {
                this.updateSystemStats(systemResponse, activityResponse);
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
            this.showToast('Failed to load admin data', 'error');
        }
    }

    updateSystemStats(systemData, groupsData) {
        const statsContainer = document.getElementById('systemStats');
        if (!statsContainer) return;

        // Calculate statistics
        const totalStudents = systemData.data ? systemData.data.length : 0;
        
        let totalCrystals = 0;
        let totalGroups = 0;

        if (groupsData.data) {
            for (const className in groupsData.data) {
                for (const level in groupsData.data[className]) {
                    const groups = groupsData.data[className][level];
                    totalGroups += Object.keys(groups).length;
                    
                    for (const groupName in groups) {
                        totalCrystals += groups[groupName].totalPoints || 0;
                    }
                }
            }
        }

        statsContainer.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>Total Students: ${totalStudents}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-gem"></i>
                <span>Total Crystals: ${this.formatPoints(totalCrystals)}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-layer-group"></i>
                <span>Active Groups: ${totalGroups}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>Last Updated: ${new Date().toLocaleTimeString()}</span>
            </div>
        `;
    }

    async applyGroupBonus(groupName, className) {
        if (!this.isAuthenticated || !this.adminToken) {
            this.showToast('Authentication required', 'error');
            return;
        }

        try {
            const response = await this.fetchData('applyGroupBonus', {
                group: groupName,
                class: className,
                token: this.adminToken
            });

            if (response.success) {
                this.showToast(`+10 bonus applied to ${response.studentsUpdated} students in ${groupName}`, 'success');
                this.createParticles('success');
                
                // Reload data
                this.loadDashboardData();
                this.loadLeaderboardData('all');
                
                // Close modal if open
                this.closeModal(document.getElementById('groupModal'));
            } else {
                throw new Error(response.error || 'Failed to apply bonus');
            }
        } catch (error) {
            console.error('Error applying group bonus:', error);
            this.showToast('Failed to apply group bonus', 'error');
        }
    }

    async updateStudentPoints(studentName, pointsChange) {
        if (!this.isAuthenticated || !this.adminToken) {
            this.showToast('Authentication required', 'error');
            return;
        }

        try {
            const response = await this.fetchData('updatePoints', {
                name: studentName,
                change: pointsChange,
                token: this.adminToken
            });

            if (response.success) {
                const changeText = pointsChange >= 0 ? `+${pointsChange}` : pointsChange;
                this.showToast(`${changeText} points for ${studentName}`, 'success');
                this.createParticles('success');
                
                // Reload data
                this.loadDashboardData();
                this.loadLeaderboardData('all');
            } else {
                throw new Error(response.error || 'Failed to update points');
            }
        } catch (error) {
            console.error('Error updating student points:', error);
            this.showToast('Failed to update points', 'error');
        }
    }

    async resetAllPoints() {
        if (!this.isAuthenticated || !this.adminToken) {
            this.showToast('Authentication required', 'error');
            return;
        }

        if (!confirm('Are you sure you want to reset ALL points? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await this.fetchData('resetAll', {
                token: this.adminToken
            });

            if (response.success) {
                this.showToast(`Reset all points for ${response.studentsReset} students`, 'success');
                this.createParticles('success');
                
                // Reload all data
                this.loadDashboardData();
                this.loadLeaderboardData('all');
                this.loadAdminData();
            } else {
                throw new Error(response.error || 'Failed to reset points');
            }
        } catch (error) {
            console.error('Error resetting points:', error);
            this.showToast('Failed to reset points', 'error');
        }
    }

    async initializeSystemData() {
        if (!this.isAuthenticated) {
            this.showToast('Authentication required', 'error');
            return;
        }

        try {
            const response = await this.fetchData('initializeData');

            if (response.success) {
                this.showToast(`System initialized with ${response.totalStudents} students`, 'success');
                this.createParticles('success');
                
                // Reload all data
                this.loadDashboardData();
                this.loadLeaderboardData('all');
                this.loadAdminData();
            } else {
                throw new Error(response.error || 'Failed to initialize data');
            }
        } catch (error) {
            console.error('Error initializing data:', error);
            this.showToast('Failed to initialize data', 'error');
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide tab content
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}Leaderboard`).classList.add('active');
    }

    updateClassDisplay() {
        const display = document.getElementById('currentClassDisplay');
        if (display) {
            display.innerHTML = `
                <i class="fas fa-graduation-cap"></i>
                ${this.currentClass}
            `;
        }
    }

    updateLastUpdated() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
        }
    }

    showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal);
        });
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove toast after delay
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    createParticles(type = 'success') {
        const container = document.getElementById('particleContainer');
        const colors = {
            success: ['#6366f1', '#8b5cf6', '#ec4899'],
            error: ['#ef4444', '#f87171', '#fca5a5'],
            info: ['#3b82f6', '#60a5fa', '#93c5fd']
        }[type] || ['#6366f1', '#8b5cf6', '#ec4899'];

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = type === 'success' ? 'sparkle' : 'confetti';
            
            if (type === 'success') {
                particle.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
            } else {
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            }
            
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '100vh';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }

    // Utility methods
    getGroupEmoji(groupName) {
        const emojiMap = {
            'Tigers': '🐯',
            'Bears': '🐼',
            'Rabbits': '🐰',
            'Foxes': '🦊',
            'Eagles': '🦅',
            'Panthers': '🐆',
            'Butterflies': '🦋',
            'Monkeys': '🐒',
            'Owls': '🦉',
            'Wolves': '🐺',
            'Lions': '🦁'
        };

        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (groupName.includes(key)) {
                return emoji;
            }
        }
        return '🐾';
    }

    shortenName(fullName) {
        if (fullName.length <= 20) return fullName;
        return fullName.substring(0, 17) + '...';
    }

    formatPoints(points) {
        if (points >= 1000) {
            return (points / 1000).toFixed(1) + 'k';
        }
        return points.toString();
    }

    async fetchData(action, params = {}) {
        const url = new URL(this.API_BASE);
        url.searchParams.append('action', action);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Public methods for global access
    switchView(view) {
        this.switchView(view);
    }

    initializeSystemData() {
        this.initializeSystemData();
    }

    exportData() {
        this.showToast('Export feature coming soon!', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JungleRewardsSystem();
});

// Add service worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}




