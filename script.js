// 🌟 Premium Jungle × Magical - Complete Frontend Logic

// API URL - Use your deployed web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwLnoJbfQDNmJaVoNkL8XbLkAKSem9-bVHrraMZcMR6ptVjZNDMl57qmqDHxXuVXibg/exec';

// Premium Application State
const APP_STATE = {
    currentUser: null,
    isAdmin: false,
    currentClass: '4 Pearl',
    authToken: null,
    currentView: 'visitor',
    groupsData: {},
    premiumFeatures: true,
    isLoading: true
};

// Enhanced Malaysian Name Display
function getDisplayName(malaysianName) {
    if (!malaysianName) return '';
    
    // Remove common suffixes and prefixes, keep the meaningful parts
    const name = malaysianName
        .replace(/BIN\s+/gi, '')
        .replace(/BINTI\s+/gi, '')
        .replace(/BINTE\s+/gi, '')
        .replace(/ANAK\s+/gi, '')
        .trim();
    
    // Take first 2-3 words for better identification
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length >= 3) {
        return words.slice(0, 3).join(' ');
    } else if (words.length === 2) {
        return words.join(' ');
    } else {
        return words[0] || malaysianName;
    }
}

// Premium API Communication with better error handling
async function callAPI(params = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
        const urlParams = new URLSearchParams(params);
        console.log('🔄 Calling API:', params.action, 'with params:', params);
        
        const response = await fetch(`${API_URL}?${urlParams}`, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response received:', data);
        return data;
        
    } catch (error) {
        console.error('❌ API Call failed:', error);
        clearTimeout(timeoutId);
        
        // Return enhanced mock data for development
        return getEnhancedMockData(params.action, params);
    }
}

// Enhanced Mock Data with ALL your students
function getEnhancedMockData(action, params) {
    console.log('🔄 Using enhanced mock data for:', action);
    
    const mockGroups = {
        "4 Pearl": {
            "Pre-A1": {
                "🐯 The Mighty Tigers": {
                    totalPoints: 245,
                    members: [
                        { name: "ADELLA KAISARA BINTI AMDAN", points: 65 },
                        { name: "AHMAD JIHAD BIN ABDULLAH", points: 58 },
                        { name: "ANJENNY PAILEE", points: 72 },
                        { name: "AZIZAH ALISHA BINTI AZMIZAN AZRIN", points: 35 },
                        { name: "AZIB ARYAN BIN A.RAHMAN", points: 15 }
                    ]
                },
                "🐼 The Brave Bears": {
                    totalPoints: 198,
                    members: [
                        { name: "GIDEON GALE GARRY", points: 45 },
                        { name: "FAREL BIN ARSID", points: 52 },
                        { name: "INDRA PUTRA BIN JAINI", points: 38 },
                        { name: "MOHAMMAD ABDUL KHALIQ BIN NAISAR", points: 33 },
                        { name: "MOHAMAD NUR ZAQIF ZIQRI BIN MOHAMAD TINO", points: 30 }
                    ]
                },
                "🐰 The Swift Rabbits": {
                    totalPoints: 215,
                    members: [
                        { name: "MUHAMMAD DANISH IFWAT BIN MUHAMMAD IFFAD", points: 55 },
                        { name: "MOHAMAD AL HAKIM BIN MOHAMAD RAJAN", points: 48 },
                        { name: "MOHAMAD RAID RUZAIMIE BIN MOHD SALIHAN", points: 42 },
                        { name: "NUR AIN HAWA SYAKIELA BINTI ILHAM SUKRI", points: 35 },
                        { name: "MUHAMMAD IRMANSYAH BIN ABDUL BASIR", points: 35 }
                    ]
                }
            },
            "Low A1": {
                "🦊 The Clever Foxes": {
                    totalPoints: 180,
                    members: [
                        { name: "MUHAMMAD YUSUF BIN ANNUAR", points: 45 },
                        { name: "NOR ZAMIRAH QALISYAH BINTI MOHD ZAMIRUL", points: 40 },
                        { name: "MUHAMMAD RAYYAN BIN ARNER", points: 35 },
                        { name: "MUHAMMAD AKIF QAIYYUM BIN RANO", points: 32 },
                        { name: "MUHAMMAD ASNAWI BIN HAMZAH", points: 28 }
                    ]
                }
            },
            "Mid A1": {
                "🦅 The Brave Eagles": {
                    totalPoints: 225,
                    members: [
                        { name: "NOOR QASEH NADIA BINTI ABDULLAH", points: 60 },
                        { name: "MIESYA NUR SYAZIERRA BINTI ISA", points: 55 },
                        { name: "MOHAMAD WAN MARZUQI BIN MAZLAN", points: 45 },
                        { name: "NOR FATIYYAH FARAHANIE BINTI ZAINI", points: 35 },
                        { name: "MUHAMMAD NAZRIN BIN ZULLASRI", points: 30 }
                    ]
                },
                "🐆 The Swift Panthers": {
                    totalPoints: 195,
                    members: [
                        { name: "MUHAMMAD AL FATIH BIN MOHAMAD FAIZAL AFINDI", points: 50 },
                        { name: "NUBHAN BIN JAMIL", points: 45 },
                        { name: "NURUL FARAH KHALISYAH BINTI PABIL", points: 40 },
                        { name: "NURUL ALISA SAPPIKA BINTI ABDULLAH", points: 35 },
                        { name: "MUHAMMAD FAIS BIN HENRAL", points: 25 }
                    ]
                }
            },
            "High A1": {
                "🦋 The Shining Butterflies": {
                    totalPoints: 268,
                    members: [
                        { name: "PUTRI ARIESA ZULAIKHA BINTI JUISAL", points: 65 },
                        { name: "PUTERI MYA ARLISSA BINTI MOHD BAKRI", points: 58 },
                        { name: "MUHAMMAD IRFAN BIN UDAYKUMAR CHOCKALINGAM SHANMUGAM", points: 50 },
                        { name: "MUHAMMAD IKMAL BIN RIDSMAR", points: 45 },
                        { name: "SYARIF ABDUL HALIM BIN ALNASIR", points: 35 },
                        { name: "SITI NUR PUTRI BALQISHAH BINTI MOHD ZALANI", points: 15 }
                    ]
                }
            }
        },
        "4 Crystal": {
            "Pre-A1": {
                "🐒 The Playful Monkeys": {
                    totalPoints: 312,
                    members: [
                        { name: "ASHIRAH BINTI ASIS", points: 75 },
                        { name: "AIDIL FAZLI BIN ABDULLAH", points: 68 },
                        { name: "AL SYAMIR BIN ABDUL NASIR", points: 55 },
                        { name: "ELYANA BINTI MARTIN", points: 45 },
                        { name: "HAFIZAM AKIM BIN ABDUL AZIS", points: 35 },
                        { name: "HAIJAL BIN JAINAL", points: 18 },
                        { name: "IMANINA HUSNA BINTI MUHAMMAD SALI", points: 16 },
                        { name: "MOHAMMAD HAIKAL HAKIMI BIN ABDULLAH", points: 0 },
                        { name: "MOHAMMAD AIREIL DANNISH BIN ASYRAT", points: 0 }
                    ]
                },
                "🦉 The Wise Owls": {
                    totalPoints: 285,
                    members: [
                        { name: "MOHAMED DANIEL IMAN BIN BOHARI", points: 65 },
                        { name: "MOHAMAD RAIDI SAHRIMAL BIN JAMRI", points: 58 },
                        { name: "MUHAMAD AZRUL BIN AZLAN", points: 52 },
                        { name: "MUHAMMAD NOOR FAZRIE BIN AMRAN", points: 45 },
                        { name: "NUR ARYSA QAISARA BINTI MASRI", points: 35 },
                        { name: "NAEL BIN MOHD NIJAR", points: 15 },
                        { name: "NIRWANSA BIN RANO", points: 10 },
                        { name: "NORAINA BINTI ABDULLAH", points: 5 }
                    ]
                },
                "🐺 The Fearless Wolves": {
                    totalPoints: 275,
                    members: [
                        { name: "NUR PATIAH BINTI ABDULLAH", points: 62 },
                        { name: "NUR KHATIJA BINTI IBRAHIM", points: 55 },
                        { name: "NURUL HUMAIRA BINTI ASANAL", points: 48 },
                        { name: "NAISHA BINTI AZMAN", points: 42 },
                        { name: "NUR AFFINA AULIA BINTI RIZAL", points: 35 },
                        { name: "MUHAMMAD DANNY ASHRAF BIN ABDULLAH", points: 18 },
                        { name: "MUHAMMAD AADAM KHALIF BIN MUHAMMAD HAIRUL NIZAM", points: 10 },
                        { name: "NURAISYAH NATASYA BINTI MOHD HANIF WASNI", points: 5 }
                    ]
                },
                "🦁 The Glorious Lions": {
                    totalPoints: 325,
                    members: [
                        { name: "NURAZLIYANAH BATRISHA BINTI SABRI", points: 75 },
                        { name: "MOHAMAD RIZANI SYAHIZIEY BIN ABDULLAH", points: 68 },
                        { name: "MUHAMMAD HAIZUL BIN OMAR", points: 60 },
                        { name: "MUHAMMAD QAWIEM RAFIQ BIN RAZLAN", points: 52 },
                        { name: "NUR AZMINA BINTI ABDULLAH", points: 45 },
                        { name: "MOHAMMAD SHAZWAN BIN NAZMI", points: 15 },
                        { name: "NURUL ALYA ZULAIKHA BINTI SINAKASONI", points: 5 },
                        { name: "NURLUTHFIA AZZAHRA BINTI JUWAWI", points: 3 },
                        { name: "SITI UMAIRAH BINTI IBRAHIM", points: 2 },
                        { name: "WHIRYAN SHAH BIN MOHD NORHISMAL", points: 0 },
                        { name: "MUHAMMAD HAFIZ UQASYAH BIN ABDULLAH", points: 0 }
                    ]
                }
            }
        }
    };

    switch(action) {
        case 'getGroups':
            const classData = params.class ? { [params.class]: mockGroups[params.class] } : mockGroups;
            return {
                success: true,
                data: classData,
                premium: true,
                timestamp: new Date().toISOString(),
                isMockData: true
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
        case 'initializeData':
            return {
                success: true,
                message: "Mock data initialized successfully",
                totalStudents: 72,
                premium: true
            };
        default:
            return { 
                success: true, 
                message: 'Premium mock response',
                premium: true 
            };
    }
}

// Enhanced initialization
async function initializePremiumApp() {
    console.log('🚀 Initializing Premium Jungle App...');
    
    showLoadingScreen();
    checkStoredAuth();
    setupPremiumEventListeners();
    updateUIForAuth();
    
    try {
        await loadDashboardData(APP_STATE.currentClass);
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Welcome to Jungle × Magical! 🎉', 'success');
    } finally {
        setTimeout(() => {
            hideLoadingScreen();
            showToast('Welcome to the Enchanted Jungle! 🌟✨', 'success');
            createSparkleEffect();
            APP_STATE.isLoading = false;
        }, 2500);
    }
}

// Loading screen functions
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

// Premium Data Loading
async function loadDashboardData(className = APP_STATE.currentClass) {
    try {
        showToast('Loading jungle data...', 'info');
        
        const result = await callAPI({
            action: 'getGroups',
            class: className
        });
        
        if (result.success) {
            APP_STATE.groupsData = result.data;
            renderPremiumDashboard(className);
            updateLastUpdated();
            
            if (result.isMockData) {
                showToast('Using demo data - All 72 students loaded! 🎉', 'info');
            } else {
                showToast('Real data loaded successfully! ✅', 'success');
            }
        } else {
            throw new Error(result.error || 'Failed to load data');
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Using enhanced demo data with all students 📊', 'info');
        
        APP_STATE.groupsData = getEnhancedMockData('getGroups', { class: className }).data;
        renderPremiumDashboard(className);
        updateLastUpdated();
    }
}

// Premium Dashboard Rendering
function renderPremiumDashboard(className) {
    const grid = document.getElementById('groupsGrid');
    if (!grid) return;
    
    try {
        const classData = APP_STATE.groupsData[className];
        if (!classData || Object.keys(classData).length === 0) {
            grid.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-search"></i>
                    <h3>No Jungle Tribes Found</h3>
                    <p>No data found for ${className}. The jungle is quiet...</p>
                    ${APP_STATE.isAdmin ? `
                        <button class="premium-btn" onclick="initializeSystemData()" style="margin-top: 1rem;">
                            <i class="fas fa-database"></i>
                            Initialize Data
                        </button>
                    ` : ''}
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
        
        if (allGroups.length === 0) {
            html = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <p>No groups found in ${className}</p>
                </div>
            `;
        } else {
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
                                ${group.members.length > 3 ? `
                                    <div class="more-members">
                                        +${group.members.length - 3} more adventurers
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="group-actions">
                            <button class="premium-btn outline" onclick="openGroupModal('${group.name.replace(/'/g, "\\'")}', '${className}')">
                                <i class="fas fa-eye"></i>
                                View Tribe
                            </button>
                            ${APP_STATE.isAdmin ? `
                                <button class="premium-btn" onclick="applyGroupBonus('${group.name.replace(/'/g, "\\'")}', '${className}')">
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
        }
        
        grid.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        grid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load dashboard data</p>
                <button class="premium-btn" onclick="loadDashboardData('${className}')">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }
}

// Leaderboard Functions
async function loadLeaderboardData(className = 'all') {
    try {
        const result = await callAPI({
            action: 'getGroups',
            class: className === 'all' ? '' : className
        });
        
        if (result.success) {
            APP_STATE.groupsData = result.data;
            renderLeaderboard(className);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        APP_STATE.groupsData = getEnhancedMockData('getGroups', { class: className }).data;
        renderLeaderboard(className);
    }
}

function renderLeaderboard(className) {
    const groupsContent = document.getElementById('groupsLeaderboardContent');
    const individualsContent = document.getElementById('individualsLeaderboardContent');
    
    if (!groupsContent || !individualsContent) return;
    
    // Render Groups Leaderboard
    const groupsData = processGroupsLeaderboard(className);
    groupsContent.innerHTML = groupsData.length > 0 ? renderGroupsLeaderboardHTML(groupsData) : `
        <div class="no-data">
            <i class="fas fa-users"></i>
            <p>No groups found</p>
        </div>
    `;
    
    // Render Individuals Leaderboard
    const individualsData = processIndividualsLeaderboard(className);
    individualsContent.innerHTML = individualsData.length > 0 ? renderIndividualsLeaderboardHTML(individualsData) : `
        <div class="no-data">
            <i class="fas fa-user"></i>
            <p>No students found</p>
        </div>
    `;
}

function processGroupsLeaderboard(className) {
    const data = className === 'all' ? APP_STATE.groupsData : { [className]: APP_STATE.groupsData[className] };
    const allGroups = [];
    
    for (const classKey in data) {
        for (const level in data[classKey]) {
            for (const groupName in data[classKey][level]) {
                const group = data[classKey][level][groupName];
                allGroups.push({
                    name: groupName,
                    class: classKey,
                    level: level,
                    mascot: groupName.split(' ')[0],
                    totalPoints: group.totalPoints,
                    memberCount: group.members.length,
                    averagePoints: Math.round(group.totalPoints / group.members.length)
                });
            }
        }
    }
    
    return allGroups.sort((a, b) => b.totalPoints - a.totalPoints);
}

function processIndividualsLeaderboard(className) {
    const data = className === 'all' ? APP_STATE.groupsData : { [className]: APP_STATE.groupsData[className] };
    const allIndividuals = [];
    
    for (const classKey in data) {
        for (const level in data[classKey]) {
            for (const groupName in data[classKey][level]) {
                const group = data[classKey][level][groupName];
                group.members.forEach(member => {
                    allIndividuals.push({
                        name: member.name,
                        class: classKey,
                        group: groupName,
                        level: level,
                        mascot: groupName.split(' ')[0],
                        points: member.points
                    });
                });
            }
        }
    }
    
    return allIndividuals.sort((a, b) => b.points - a.points);
}

function renderGroupsLeaderboardHTML(groups) {
    return `
        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Group</span>
            <span>Points</span>
        </div>
        <div class="leaderboard-list">
            ${groups.map((group, index) => `
                <div class="leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}">
                    <div class="rank">
                        ${index < 3 ? `
                            <div class="rank-medal">
                                <i class="fas fa-trophy"></i>
                                <span>${index + 1}</span>
                            </div>
                        ` : `
                            <span class="rank-number">#${index + 1}</span>
                        `}
                    </div>
                    <div class="group-info">
                        <div class="group-mascot">${group.mascot}</div>
                        <div class="group-details">
                            <h4 class="group-name">${group.name}</h4>
                            <p class="group-meta">${group.class} • ${group.level}</p>
                        </div>
                    </div>
                    <div class="points">
                        <div class="points-badge">
                            <i class="fas fa-gem"></i>
                            ${group.totalPoints}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderIndividualsLeaderboardHTML(individuals) {
    return `
        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Points</span>
        </div>
        <div class="leaderboard-list">
            ${individuals.map((student, index) => `
                <div class="leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}">
                    <div class="rank">
                        ${index < 3 ? `
                            <div class="rank-medal">
                                <i class="fas fa-trophy"></i>
                                <span>${index + 1}</span>
                            </div>
                        ` : `
                            <span class="rank-number">#${index + 1}</span>
                        `}
                    </div>
                    <div class="student-info">
                        <div class="student-avatar">${student.mascot}</div>
                        <div class="student-details">
                            <h4 class="student-name">${getDisplayName(student.name)}</h4>
                            <p class="student-meta">${student.group} • ${student.class}</p>
                        </div>
                    </div>
                    <div class="points">
                        <div class="points-badge">
                            <i class="fas fa-gem"></i>
                            ${student.points}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Enhanced Group Modal
function openGroupModal(groupName, className) {
    const classData = APP_STATE.groupsData[className];
    if (!classData) return;
    
    // Find the group
    let targetGroup = null;
    let targetLevel = '';
    
    for (const level in classData) {
        if (classData[level][groupName]) {
            targetGroup = {
                name: groupName,
                level: level,
                mascot: groupName.split(' ')[0],
                ...classData[level][groupName]
            };
            targetLevel = level;
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
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name.replace(/'/g, "\\'")}', 10)">
                            <i class="fas fa-plus"></i>
                            10
                        </button>
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name.replace(/'/g, "\\'")}', 5)">
                            <i class="fas fa-plus"></i>
                            5
                        </button>
                        <button class="premium-btn small" onclick="updateStudentPoints('${member.name.replace(/'/g, "\\'")}', 1)">
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
                <div class="members-table">
                    ${membersHtml || '<p>No members found</p>'}
                </div>
            </div>
        </div>
    `;
    
    groupNameElement.innerHTML = `<i class="fas fa-users"></i> ${targetGroup.name}`;
    modal.classList.remove('hidden');
    createSparkleEffect();
}

// Authentication functions
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

// Point management functions
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
    } else {
        showToast(`Failed to update points: ${result.error}`, 'error');
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

async function initializeSystemData() {
    if (!APP_STATE.authToken) {
        showLoginModal();
        return { success: false, error: 'Not authenticated' };
    }
    
    if (!confirm('This will initialize/refresh all student data. Continue?')) {
        return;
    }
    
    const result = await callAPI({
        action: 'initializeData'
    });
    
    if (result.success) {
        showToast('System data initialized successfully! 🎉', 'success');
        loadDashboardData(APP_STATE.currentClass);
    } else {
        showToast('Failed to initialize data: ' + result.error, 'error');
    }
    
    return result;
}

// UI Management functions
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
            passwordInput.focus();
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

// Page Navigation
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
    } else if (pageName === 'leaderboard') {
        loadLeaderboardData('all');
    } else if (pageName === 'admin') {
        updateSystemStats();
    }
    
    createSparkleEffect();
}

function switchLeaderboardTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.toggle('active', tab.id === tabName + 'Leaderboard');
    });
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

// Utility functions
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

// Event Listeners
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
    
    // Leaderboard class selector
    const leaderboardClassSelector = document.getElementById('leaderboardClassSelector');
    if (leaderboardClassSelector) {
        leaderboardClassSelector.addEventListener('change', (e) => {
            loadLeaderboardData(e.target.value);
        });
    }
    
    // Leaderboard tab buttons
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchLeaderboardTab(e.currentTarget.dataset.tab);
        });
    });
    
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

// Initialize app
let loadingTimeout = setTimeout(() => {
    if (APP_STATE.isLoading) {
        console.warn('⚠️ Loading timeout reached, forcing app display');
        hideLoadingScreen();
        showToast('App loaded successfully! 🎉', 'success');
        APP_STATE.isLoading = false;
    }
}, 10000);

function clearLoadingTimeout() {
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
    }
}

async function safeInitializeApp() {
    await initializePremiumApp();
    clearLoadingTimeout();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInitializeApp);
} else {
    safeInitializeApp();
}

// Export function
function exportData() {
    showToast('Export feature coming soon! 📊', 'info');
}

// Make functions global
window.openGroupModal = openGroupModal;
window.updateStudentPoints = updateStudentPoints;
window.applyGroupBonus = applyGroupBonus;
window.showLoginModal = showLoginModal;
window.switchView = switchView;
window.switchPage = switchPage;
window.exportData = exportData;
window.initializeSystemData = initializeSystemData;
window.switchLeaderboardTab = switchLeaderboardTab;
window.loadLeaderboardData = loadLeaderboardData;
