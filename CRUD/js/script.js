const courtsData = [
    {
        id: 1,
        name: 'Arena Beach Copacabana',
        location: 'Copacabana, Rio de Janeiro',
        price: 80,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
        features: ['Ar condicionado', 'Vestiário', 'Estacionamento', 'Lanchonete'],
        rating: 4.8
    },
    {
        id: 2,
        name: 'Beach Club Barra',
        location: 'Barra da Tijuca, Rio de Janeiro',
        price: 90,
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=200&fit=crop',
        features: ['Vista para o mar', 'Bar', 'Equipamentos inclusos', 'Wi-Fi'],
        rating: 4.9
    },
    {
        id: 3,
        name: 'Ipanema Beach Sports',
        location: 'Ipanema, Rio de Janeiro',
        price: 75,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop',
        features: ['Quadra premium', 'Vestiário', 'Área de descanso', 'Segurança'],
        rating: 4.7
    }
];

const tournamentsData = [
    {
        id: 1,
        title: 'Copa Verão Beach Tennis',
        category: 'Iniciante/Intermediário',
        date: '15 Jan 2024',
        time: '08:00',
        location: 'Arena Beach Copacabana',
        participants: 32,
        maxParticipants: 64,
        prize: 'R$ 2.500',
        status: 'Inscrições Abertas',
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=200&fit=crop'
    },
    {
        id: 2,
        title: 'Torneio Sunset Championship',
        category: 'Avançado',
        date: '22 Jan 2024',
        time: '16:00',
        location: 'Beach Club Barra',
        participants: 28,
        maxParticipants: 32,
        prize: 'R$ 5.000',
        status: 'Últimas Vagas',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop'
    },
    {
        id: 3,
        title: 'Festival Beach Tennis Kids',
        category: 'Infantil (8-14 anos)',
        date: '28 Jan 2024',
        time: '09:00',
        location: 'Ipanema Beach Sports',
        participants: 16,
        maxParticipants: 24,
        prize: 'Medalhas e Troféus',
        status: 'Inscrições Abertas',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop'
    }
];

const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// State Management
let selectedCourt = null;
let selectedDate = null;
let selectedTime = null;
let authMode = 'login'; // 'login' or 'register'

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const heroRegisterBtn = document.getElementById('heroRegisterBtn');
const heroCourtsBtn = document.getElementById('heroCourtsBtn');
const authModal = document.getElementById('authModal');
const modalClose = document.getElementById('modalClose');
const authForm = document.getElementById('authForm');
const authSwitchBtn = document.getElementById('authSwitchBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    renderCourts();
    renderTournaments();
    setupBookingForm();
    setupSmoothScrolling();
    setMinDate();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Auth buttons
    loginBtn.addEventListener('click', () => openAuthModal('login'));
    registerBtn.addEventListener('click', () => openAuthModal('register'));
    heroRegisterBtn.addEventListener('click', () => openAuthModal('register'));
    
    // Modal
    modalClose.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
    
    // Auth form
    authForm.addEventListener('submit', handleAuthSubmit);
    authSwitchBtn.addEventListener('click', switchAuthMode);
    
    // Hero buttons
    heroCourtsBtn.addEventListener('click', () => {
        document.getElementById('quadras').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAuthModal();
    });
}

// Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Auth Modal Functions
function openAuthModal(mode) {
    authMode = mode;
    updateAuthModal();
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    authForm.reset();
}

function switchAuthMode() {
    authMode = authMode === 'login' ? 'register' : 'login';
    updateAuthModal();
}

function updateAuthModal() {
    const modalTitle = document.getElementById('modalTitle');
    const authSubmit = document.getElementById('authSubmit');
    const authSwitchText = document.getElementById('authSwitchText');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    if (authMode === 'login') {
        modalTitle.textContent = 'Entrar';
        authSubmit.textContent = 'Entrar';
        authSwitchText.textContent = 'Não tem uma conta?';
        authSwitchBtn.textContent = 'Criar conta';
        nameGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
    } else {
        modalTitle.textContent = 'Criar Conta';
        authSubmit.textContent = 'Criar Conta';
        authSwitchText.textContent = 'Já tem uma conta?';
        authSwitchBtn.textContent = 'Fazer login';
        nameGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(authForm);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (authMode === 'register') {
        if (data.password !== data.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
    }
    
    // Simulate auth request - Save user data and redirect to dashboard
    console.log('Auth data:', data);
    
    // Save user data to localStorage (simulated login)
    const userData = {
        name: data.name || 'Usuário',
        firstName: (data.name || 'Usuário').split(' ')[0],
        email: data.email,
        phone: data.phone
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    alert(authMode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
    closeAuthModal();
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

// Render Functions
function renderCourts() {
    const courtsGrid = document.getElementById('courtsGrid');
    
    courtsGrid.innerHTML = courtsData.map(court => `
        <div class="court-card animate-fade-in-up">
            <img src="${court.image}" alt="${court.name}" class="court-image">
            <h3 class="court-title">${court.name}</h3>
            <p class="court-location">📍 ${court.location}</p>
            <div class="court-features">
                ${court.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="court-price">R$ ${court.price}/hora</div>
            <button class="btn btn-hero btn-full">
                <span class="btn-icon">📅</span>
                Reservar Agora
            </button>
        </div>
    `).join('');
}

function renderTournaments() {
    const tournamentsGrid = document.getElementById('tournamentsGrid');
    
    tournamentsGrid.innerHTML = tournamentsData.map(tournament => `
        <div class="tournament-card animate-fade-in-up">
            <div class="tournament-image" style="background-image: url('${tournament.image}')">
                <div class="tournament-status">${tournament.status}</div>
            </div>
            <div class="tournament-content">
                <h3 class="tournament-title">${tournament.title}</h3>
                <p class="tournament-category">${tournament.category}</p>
                
                <div class="tournament-info">
                    <div class="tournament-detail">
                        <span class="tournament-icon">📅</span>
                        <span>${tournament.date}</span>
                        <span class="tournament-icon">⏰</span>
                        <span>${tournament.time}</span>
                    </div>
                    <div class="tournament-detail">
                        <span class="tournament-icon">📍</span>
                        <span>${tournament.location}</span>
                    </div>
                    <div class="tournament-detail">
                        <span class="tournament-icon">👥</span>
                        <span>${tournament.participants}/${tournament.maxParticipants} inscritos</span>
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(tournament.participants / tournament.maxParticipants) * 100}%"></div>
                </div>
                
                <div class="tournament-prize">
                    <div class="prize-label">Premiação</div>
                    <div class="prize-amount">${tournament.prize}</div>
                </div>
                
                <button class="btn ${tournament.status === 'Últimas Vagas' ? 'btn-hero' : 'btn-outline'} btn-full">
                    <span class="btn-icon">🏆</span>
                    ${tournament.status === 'Últimas Vagas' ? 'Inscrever-se Agora!' : 'Participar'}
                </button>
            </div>
        </div>
    `).join('');
}

// Booking System
function setupBookingForm() {
    const courtOptions = document.getElementById('courtOptions');
    const timeGrid = document.getElementById('timeGrid');
    const bookingDate = document.getElementById('bookingDate');
    const finalizeBooking = document.getElementById('finalizeBooking');
    
    // Render court options
    courtOptions.innerHTML = courtsData.map(court => `
        <div class="court-option" data-court-id="${court.id}">
            <span class="court-name">${court.name}</span>
            <span class="court-price-text">R$ ${court.price}/h</span>
        </div>
    `).join('');
    
    // Render time slots
    timeGrid.innerHTML = timeSlots.map(time => `
        <button class="time-slot" data-time="${time}">${time}</button>
    `).join('');
    
    // Court selection
    courtOptions.addEventListener('click', (e) => {
        const courtOption = e.target.closest('.court-option');
        if (!courtOption) return;
        
        // Remove previous selection
        document.querySelectorAll('.court-option').forEach(opt => opt.classList.remove('selected'));
        
        // Select new court
        courtOption.classList.add('selected');
        selectedCourt = parseInt(courtOption.dataset.courtId);
        
        updateBookingSummary();
    });
    
    // Time selection
    timeGrid.addEventListener('click', (e) => {
        if (!e.target.classList.contains('time-slot')) return;
        
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        
        // Select new time
        e.target.classList.add('selected');
        selectedTime = e.target.dataset.time;
        
        updateBookingSummary();
    });
    
    // Date selection
    bookingDate.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        updateBookingSummary();
    });
    
    // Finalize booking
    finalizeBooking.addEventListener('click', () => {
        if (!selectedCourt || !selectedDate || !selectedTime) {
            alert('Por favor, complete todos os campos da reserva.');
            return;
        }
        
        const court = courtsData.find(c => c.id === selectedCourt);
        alert(`Reserva confirmada!\n\nQuadra: ${court.name}\nData: ${formatDate(selectedDate)}\nHorário: ${selectedTime}\nTotal: R$ ${court.price}`);
    });
}

function updateBookingSummary() {
    const selectedCourtName = document.getElementById('selectedCourtName');
    const selectedDateEl = document.getElementById('selectedDate');
    const selectedTimeEl = document.getElementById('selectedTime');
    const totalPrice = document.getElementById('totalPrice');
    const finalizeBooking = document.getElementById('finalizeBooking');
    
    // Update court name
    if (selectedCourt) {
        const court = courtsData.find(c => c.id === selectedCourt);
        selectedCourtName.textContent = court.name;
        totalPrice.textContent = `R$ ${court.price}`;
    } else {
        selectedCourtName.textContent = 'Selecione';
        totalPrice.textContent = 'R$ 0';
    }
    
    // Update date
    selectedDateEl.textContent = selectedDate ? formatDate(selectedDate) : 'Selecione';
    
    // Update time
    selectedTimeEl.textContent = selectedTime || 'Selecione';
    
    // Enable/disable booking button
    finalizeBooking.disabled = !selectedCourt || !selectedDate || !selectedTime;
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function setMinDate() {
    const bookingDate = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
}

// Animations on Scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-fade-in-up, .animate-slide-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when page loads
window.addEventListener('load', setupScrollAnimations);