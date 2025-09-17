// ============================
// CONFIG
// ============================
const API_BASE = "http://localhost:8080/api"; // URL do backend Spring Boot

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// ============================
// INITIALIZE DASHBOARD
// ============================
function initializeDashboard() {
    setupEventListeners();
    loadUserData();
    updateMyTeams(); // Carrega os times do usuário
    setupMobileMenu();
    setupScrollAnimations();
}

// ============================
// EVENT LISTENERS
// ============================
function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const createTeamCard = document.getElementById('createTeamCard');
    const joinTeamCard = document.getElementById('joinTeamCard');
    const joinTournamentCard = document.getElementById('joinTournamentCard');
    const bookCourtCard = document.getElementById('bookCourtCard');

    if (createTeamCard) createTeamCard.addEventListener('click', () => handleActionClick('create-team'));
    if (joinTeamCard) joinTeamCard.addEventListener('click', () => handleActionClick('join-team'));
    if (joinTournamentCard) joinTournamentCard.addEventListener('click', () => handleActionClick('join-tournament'));
    if (bookCourtCard) bookCourtCard.addEventListener('click', () => handleActionClick('book-court'));

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// ============================
// USER DATA
// ============================
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser')) || { name: 'João Silva', firstName: 'João' };
    const userNameEl = document.getElementById('userName');
    const welcomeUserEl = document.getElementById('welcomeUser');
    if (userNameEl) userNameEl.textContent = userData.name;
    if (welcomeUserEl) welcomeUserEl.textContent = userData.firstName;
}

// ============================
// ACTION HANDLER
// ============================
function handleActionClick(action) {
    switch (action) {
        case 'create-team': showCreateTeamModal(); break;
        case 'join-team': showJoinTeamModal(); break;
        case 'join-tournament': window.location.href = 'index.html#campeonatos'; break;
        case 'book-court': window.location.href = 'index.html#reservas'; break;
    }
}

// ============================
// MODALS
// ============================
function showCreateTeamModal() {
    showModal("Criar Time", `
        <form id="createTeamForm">
            <div class="form-group">
                <label>Nome do Time</label>
                <input type="text" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea class="form-input"></textarea>
            </div>
            <div class="form-group">
                <label>Nível</label>
                <select class="form-input">
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                </select>
            </div>
            <button type="submit" class="btn btn-hero btn-full">Criar Time</button>
        </form>
    `);

    const form = document.getElementById('createTeamForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = form.querySelector('input').value;
        const description = form.querySelector('textarea').value;
        const level = form.querySelector('select').value;

        try {
            const res = await fetch(`${API_BASE}/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, level })
            });
            if (!res.ok) throw new Error("Erro ao criar time");
            alert("Time criado com sucesso!");
            closeDashboardModal();
            updateMyTeams(); // Atualiza lista automaticamente
        } catch (err) {
            console.error(err);
            alert("Erro ao criar o time.");
        }
    });
}

function showJoinTeamModal() {
    showModal("Procurar Times", `
        <div class="form-group">
            <input type="text" id="searchTeamInput" class="form-input" placeholder="Buscar por nome...">
        </div>
        <div id="teamList" class="team-list"></div>
    `);

    loadTeams();
}

// ============================
// CRUD TEAMS
// ============================
async function loadTeams() {
    try {
        const res = await fetch(`${API_BASE}/teams`);
        const teams = await res.json();
        const teamList = document.getElementById('teamList');

        if (!teams.length) {
            teamList.innerHTML = "<p>Nenhum time encontrado.</p>";
            return;
        }

        teamList.innerHTML = teams.map(team => `
            <div class="team-item">
                <h4>${team.name}</h4>
                <p>Nível: ${team.level} • ${team.description || "Sem descrição"}</p>
                <button class="btn btn-outline" onclick="viewTeam('${team.id}')">Ver Detalhes</button>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function updateMyTeams() {
    try {
        const res = await fetch(`${API_BASE}/teams`);
        const teams = await res.json();
        const myTeamsEl = document.getElementById('myTeams');

        if (!teams.length) {
            myTeamsEl.innerHTML = "<p>Nenhum time cadastrado.</p>";
            return;
        }

        myTeamsEl.innerHTML = teams.map(team => `
            <div class="team-card">
                <h4>${team.name}</h4>
                <p>${team.description || "Sem descrição"}</p>
                <p><b>Nível:</b> ${team.level}</p>
                <div class="team-actions">
                    <button class="btn btn-hero" onclick="editTeam('${team.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteTeam('${team.id}')">Excluir</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function viewTeam(teamId) {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}`);
        const team = await res.json();
        showModal("Detalhes do Time", `
            <h3>${team.name}</h3>
            <p><b>Nível:</b> ${team.level}</p>
            <p><b>Descrição:</b> ${team.description || "Sem descrição"}</p>
            <div class="actions">
                <button class="btn btn-hero" onclick="editTeam('${team.id}')">Editar</button>
                <button class="btn btn-danger" onclick="deleteTeam('${team.id}')">Excluir</button>
            </div>
        `);
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar detalhes do time.");
    }
}

async function editTeam(teamId) {
    try {
        const res = await fetch(`${API_BASE}/teams/${teamId}`);
        const team = await res.json();
        showModal("Editar Time", `
            <form id="editTeamForm">
                <div class="form-group">
                    <label>Nome do Time</label>
                    <input type="text" class="form-input" value="${team.name}" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea class="form-input">${team.description || ""}</textarea>
                </div>
                <div class="form-group">
                    <label>Nível</label>
                    <select class="form-input">
                        <option ${team.level==="Iniciante"?"selected":""}>Iniciante</option>
                        <option ${team.level==="Intermediário"?"selected":""}>Intermediário</option>
                        <option ${team.level==="Avançado"?"selected":""}>Avançado</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-hero btn-full">Salvar Alterações</button>
            </form>
        `);

        const form = document.getElementById('editTeamForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.querySelector('input').value;
            const description = form.querySelector('textarea').value;
            const level = form.querySelector('select').value;

            await fetch(`${API_BASE}/teams/${teamId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, level })
            });

            alert("Time atualizado com sucesso!");
            closeDashboardModal();
            updateMyTeams(); // Atualiza lista automaticamente
        });

    } catch (err) {
        console.error(err);
        alert("Erro ao editar time.");
    }
}

async function deleteTeam(teamId) {
    if (!confirm("Deseja realmente excluir este time?")) return;

    try {
        await fetch(`${API_BASE}/teams/${teamId}`, { method: 'DELETE' });
        alert("Time excluído com sucesso!");
        closeDashboardModal();
        updateMyTeams(); // Atualiza lista automaticamente
    } catch (err) {
        console.error(err);
        alert("Erro ao excluir time.");
    }
}

window.viewTeam = viewTeam;
window.editTeam = editTeam;
window.deleteTeam = deleteTeam;

// ============================
// MODAL UTILS
// ============================
function showModal(title, content) {
    const existingModal = document.getElementById('dashboardModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'dashboardModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeDashboardModal()">✕</button>
            </div>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target===modal) closeDashboardModal(); });
}

function closeDashboardModal() {
    const modal = document.getElementById('dashboardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }
}

// ============================
// LOGOUT
// ============================
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    }
}

// ============================
// MOBILE MENU
// ============================
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.toggle('active');
}

function setupMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) navMenu.classList.remove('active');
    }));
}

// ============================
// SCROLL ANIMATIONS
// ============================
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.action-card, .stat-card, .activity-item, .event-card, .team-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

window.closeDashboardModal = closeDashboardModal;
// ============================
// ATUALIZAÇÃO DE MY TEAMS E STATS
// ============================
async function updateMyTeams() {
    try {
        const res = await fetch(`${API_BASE}/teams`);
        const teams = await res.json();
        const myTeamsEl = document.getElementById('myTeams');
        const teamsStatNumber = document.querySelector('.stat-card:nth-child(2) .stat-number'); // segundo stat-card = Meus Times

        if (!teams.length) {
            myTeamsEl.innerHTML = "<p>Nenhum time cadastrado.</p>";
            if (teamsStatNumber) teamsStatNumber.textContent = "0";
            return;
        }

        // Atualiza a contagem no card de estatísticas
        if (teamsStatNumber) teamsStatNumber.textContent = teams.length;

        myTeamsEl.innerHTML = teams.map(team => `
            <div class="team-card">
                <h4>${team.name}</h4>
                <p>${team.description || "Sem descrição"}</p>
                <p><b>Nível:</b> ${team.level}</p>
                <div class="team-actions">
                    <button class="btn btn-hero" onclick="editTeam('${team.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteTeam('${team.id}')">Excluir</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
        myTeamsEl.innerHTML = "<p>Erro ao carregar times.</p>";
        const teamsStatNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (teamsStatNumber) teamsStatNumber.textContent = "0";
    }
}
