// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeF99hAgCiiCcV_PLVubfkqk1C48qGjZs",
    authDomain: "login-cf8a8.firebaseapp.com",
    projectId: "login-cf8a8",
    storageBucket: "login-cf8a8.appspot.com",
    messagingSenderId: "120301879243",
    appId: "1:120301879243:web:b5c6390fad9f74ced3c04e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Admin emails
const adminEmails = ['sadafqureshi078@gmail.com', 'muzamil@gmail.com', 'muzamilmalik754@gmail.com'];

// Global state
let currentUser = null;
let isLoading = false;

// DOM Elements
const loader = document.getElementById('loader');
const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const mainPortfolio = document.getElementById('mainPortfolio');
const adminDashboard = document.getElementById('adminDashboard');
const themeToggle = document.getElementById('themeToggle');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadContent();
    initializeTheme();
});

function initializeApp() {
    // Loading screen
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Reveal animations
    setupRevealAnimations();

    // Auth state observer
    auth.onAuthStateChanged(handleAuthStateChange);

    // Smooth scrolling
    setupSmoothScrolling();

    // Counter animations
    setupCounterAnimations();

    // Active navigation
    setupActiveNavigation();
}

function setupEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Form event listeners
    setupFormEventListeners();

    // Modal event listeners
    setupModalEventListeners();

    // Admin dashboard event listeners
    setupAdminEventListeners();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => closeModal(modal.id));
            
            // Close admin dashboard if open
            if (adminDashboard.style.display === 'block') {
                closeAdminDashboard();
            }
        }
    });
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(`Switched to ${newTheme} theme`, 'info');
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function handleScroll() {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
}

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline-item, .skill-category, .project-card, .blog-card, .publication-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.timeline-item, .skill-category, .project-card, .blog-card, .publication-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupModalEventListeners() {
    // Global modal functions
    window.showAdminLogin = () => showModal('adminModal');
    window.showChangePassword = () => showModal('changePasswordModal');
    window.showEditProfile = () => showModal('editProfileModal');
    window.closeModal = closeModal;
    window.logout = logout;
    window.exportData = exportData;
    window.resetForm = resetForm;
    window.toggleTheme = toggleTheme;

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            }
        });
    });
}

function setupAdminEventListeners() {
    // Admin sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchAdminSection(section);
            
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function setupFormEventListeners() {
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Add project form
    document.getElementById('addProjectForm').addEventListener('submit', handleAddProject);
    
    // Add blog form
    document.getElementById('addBlogForm').addEventListener('submit', handleAddBlog);
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmission);
    
    // Change password form
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    
    // Edit profile form
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Clear previous errors
    clearFormErrors('adminLoginForm');
    
    if (!validateEmail(email)) {
        showFormError('adminEmailError', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showFormError('adminPasswordError', 'Password is required');
        return;
    }
    
    showLoadingState('Authenticating...');
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (adminEmails.includes(user.email)) {
            currentUser = user;
            closeModal('adminModal');
            document.getElementById('adminLoginForm').reset();
            showNotification('Welcome to Admin Dashboard!', 'success');
            showAdminDashboard();
        } else {
            await auth.signOut();
            showNotification('Access denied. You are not authorized.', 'error');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        let errorMessage = 'Authentication failed. Please check your credentials.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        hideLoadingState();
    }
}

async function handleAddProject(e) {
    e.preventDefault();
    
    if (!validateAdminAccess()) return;
    
    // Clear previous errors
    clearFormErrors('addProjectForm');
    
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const technologies = document.getElementById('projectTech').value.trim();
    const category = document.getElementById('projectCategory').value;
    const status = document.getElementById('projectStatus').value;
    const url = document.getElementById('projectUrl').value.trim();
    const github = document.getElementById('projectGithub').value.trim();
    const image = document.getElementById('projectImage').value.trim();
    
    // Validation
    let hasErrors = false;
    
    if (!title) {
        showFormError('projectTitleError', 'Project title is required');
        hasErrors = true;
    }
    
    if (!description) {
        showFormError('projectDescriptionError', 'Project description is required');
        hasErrors = true;
    }
    
    if (!technologies) {
        showFormError('projectTechError', 'Technologies are required');
        hasErrors = true;
    }
    
    if (url && !isValidUrl(url)) {
        showFormError('projectUrlError', 'Please enter a valid URL');
        hasErrors = true;
    }
    
    if (image && !isValidUrl(image)) {
        showFormError('projectImageError', 'Please enter a valid image URL');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    const project = {
        title,
        description,
        technologies,
        category,
        status,
        url: url || null,
        github: github || null,
        image: image || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.email
    };
    
    showLoadingState('Adding project...');
    
    try {
        await db.collection('projects').add(project);
        showNotification('Project added successfully!', 'success');
        document.getElementById('addProjectForm').reset();
        await loadProjects();
        await loadAdminProjects();
        updateStats();
        
        // Switch to projects view
        switchAdminSection('projects');
        document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
        document.querySelector('[data-section="projects"]').classList.add('active');
    } catch (error) {
        console.error('Error adding project:', error);
        showNotification('Failed to add project. Please try again.', 'error');
    } finally {
        hideLoadingState();
    }
}

async function handleAddBlog(e) {
    e.preventDefault();
    
    if (!validateAdminAccess()) return;
    
    // Clear previous errors
    clearFormErrors('addBlogForm');
    
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    const excerpt = document.getElementById('blogExcerpt').value.trim();
    const tags = document.getElementById('blogTags').value.trim();
    const category = document.getElementById('blogCategory').value;
    const status = document.getElementById('blogStatus').value;
    const image = document.getElementById('blogImage').value.trim();
    
    // Validation
    let hasErrors = false;
    
    if (!title) {
        showFormError('blogTitleError', 'Blog title is required');
        hasErrors = true;
    }
    
    if (!content) {
        showFormError('blogContentError', 'Blog content is required');
        hasErrors = true;
    }
    
    if (image && !isValidUrl(image)) {
        showFormError('blogImageError', 'Please enter a valid image URL');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    const blog = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        category,
        status,
        image: image || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.email
    };
    
    showLoadingState('Publishing blog post...');
    
    try {
        await db.collection('blogs').add(blog);
        showNotification('Blog post published successfully!', 'success');
        document.getElementById('addBlogForm').reset();
        await loadBlogs();
        await loadAdminBlogs();
        updateStats();
        
        // Switch to blog view
        switchAdminSection('blog');
        document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
        document.querySelector('[data-section="blog"]').classList.add('active');
    } catch (error) {
        console.error('Error publishing blog:', error);
        showNotification('Failed to publish blog post. Please try again.', 'error');
    } finally {
        hideLoadingState();
    }
}

function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    // Simulate form submission
    showLoadingState('Sending message...');
    
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        document.getElementById('contactForm').reset();
        hideLoadingState();
    }, 1500);
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    if (!validateAdminAccess()) return;
    
    // Clear previous errors
    clearFormErrors('changePasswordForm');
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    let hasErrors = false;
    
    if (!currentPassword) {
        showFormError('currentPasswordError', 'Current password is required');
        hasErrors = true;
    }
    
    if (!newPassword) {
        showFormError('newPasswordError', 'New password is required');
        hasErrors = true;
    } else if (newPassword.length < 6) {
        showFormError('newPasswordError', 'Password must be at least 6 characters');
        hasErrors = true;
    }
    
    if (!confirmPassword) {
        showFormError('confirmPasswordError', 'Please confirm your new password');
        hasErrors = true;
    } else if (newPassword !== confirmPassword) {
        showFormError('confirmPasswordError', 'Passwords do not match');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    showLoadingState('Updating password...');
    
    try {
        // Re-authenticate user
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );
        
        await currentUser.reauthenticateWithCredential(credential);
        
        // Update password
        await currentUser.updatePassword(newPassword);
        
        showNotification('Password updated successfully!', 'success');
        closeModal('changePasswordModal');
        document.getElementById('changePasswordForm').reset();
    } catch (error) {
        console.error('Error updating password:', error);
        let errorMessage = 'Failed to update password. Please try again.';
        
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Current password is incorrect.';
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        hideLoadingState();
    }
}

function handleEditProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const title = document.getElementById('profileTitle').value;
    const bio = document.getElementById('profileBio').value;
    
    showLoadingState('Updating profile...');
    
    // Simulate profile update
    setTimeout(() => {
        showNotification('Profile updated successfully!', 'success');
        closeModal('editProfileModal');
        hideLoadingState();
    }, 1000);
}

function validateAdminAccess() {
    if (!currentUser || !adminEmails.includes(currentUser.email)) {
        showNotification('Admin access required. Please log in first.', 'error');
        return false;
    }
    return true;
}

function handleAuthStateChange(user) {
    if (user && adminEmails.includes(user.email)) {
        currentUser = user;
        document.getElementById('adminUserEmail').textContent = user.email;
    } else {
        currentUser = null;
        if (adminDashboard.style.display === 'block') {
            closeAdminDashboard();
        }
    }
}

async function logout() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully', 'success');
        closeAdminDashboard();
    } catch (error) {
        showNotification('Error logging out', 'error');
    }
}

function showAdminDashboard() {
    mainPortfolio.style.display = 'none';
    adminDashboard.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load admin data
    loadAdminData();
}

function closeAdminDashboard() {
    mainPortfolio.style.display = 'block';
    adminDashboard.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchAdminSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Load section-specific data
    switch(sectionName) {
        case 'projects':
            loadAdminProjects();
            break;
        case 'blog':
            loadAdminBlogs();
            break;
        case 'overview':
            updateStats();
            loadRecentActivity();
            break;
    }
}

// Make switchAdminSection globally available
window.switchAdminSection = switchAdminSection;

async function loadAdminData() {
    updateStats();
    loadRecentActivity();
    loadAdminProjects();
    loadAdminBlogs();
}

async function updateStats() {
    try {
        const [projectsSnapshot, blogsSnapshot] = await Promise.all([
            db.collection('projects').get(),
            db.collection('blogs').get()
        ]);
        
        document.getElementById('totalProjects').textContent = projectsSnapshot.size;
        document.getElementById('totalBlogs').textContent = blogsSnapshot.size;
    } catch (error) {
        console.error('Error updating stats:', error);
        // Set fallback values
        document.getElementById('totalProjects').textContent = '0';
        document.getElementById('totalBlogs').textContent = '0';
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    const activities = [
        {
            icon: 'fas fa-plus',
            title: 'New project added',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-edit',
            title: 'Blog post published',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-envelope',
            title: 'New message received',
            time: '3 days ago'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Analytics updated',
            time: '1 week ago'
        }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

async function loadAdminProjects() {
    const container = document.getElementById('adminProjectsGrid');
    container.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>Loading projects...</p></div>';
    
    try {
        const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.6; grid-column: 1 / -1;">No projects found.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        snapshot.forEach(doc => {
            const project = doc.data();
            const projectCard = createAdminProjectCard(doc.id, project);
            container.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error loading admin projects:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--error); grid-column: 1 / -1;">Error loading projects.</p>';
    }
}

function createAdminProjectCard(id, project) {
    const card = document.createElement('div');
    card.className = 'admin-project-card';
    
    const date = project.createdAt ? 
        new Date(project.createdAt.toDate()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Recent';
    
    card.innerHTML = `
        <div class="admin-card-header">
            <h3 class="admin-card-title">${project.title}</h3>
            <div class="admin-card-actions">
                <button class="btn-icon btn-edit" onclick="editProject('${id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteProject('${id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="admin-card-meta">Created: ${date} | Status: ${project.status || 'Completed'}</div>
        <div class="admin-card-description">${project.description}</div>
        <div class="admin-card-tech">${project.technologies}</div>
    `;
    
    return card;
}

async function loadAdminBlogs() {
    const container = document.getElementById('adminBlogGrid');
    container.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>Loading blog posts...</p></div>';
    
    try {
        const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.6; grid-column: 1 / -1;">No blog posts found.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        snapshot.forEach(doc => {
            const blog = doc.data();
            const blogCard = createAdminBlogCard(doc.id, blog);
            container.appendChild(blogCard);
        });
        
    } catch (error) {
        console.error('Error loading admin blogs:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--error); grid-column: 1 / -1;">Error loading blog posts.</p>';
    }
}

function createAdminBlogCard(id, blog) {
    const card = document.createElement('div');
    card.className = 'admin-blog-card';
    
    const date = blog.createdAt ? 
        new Date(blog.createdAt.toDate()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Recent';
    
    const excerpt = blog.content.length > 100 ? 
        blog.content.substring(0, 100) + '...' : 
        blog.content;
    
    card.innerHTML = `
        <div class="admin-card-header">
            <h3 class="admin-card-title">${blog.title}</h3>
            <div class="admin-card-actions">
                <button class="btn-icon btn-edit" onclick="editBlog('${id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteBlog('${id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="admin-card-meta">Published: ${date} | Status: ${blog.status || 'Published'}</div>
        <div class="admin-card-description">${excerpt}</div>
        <div class="admin-card-tech">${blog.tags.join(', ')}</div>
    `;
    
    return card;
}

// Global functions for admin actions
window.editProject = (id) => {
    showNotification('Edit functionality coming soon!', 'info');
};

window.deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        await db.collection('projects').doc(id).delete();
        showNotification('Project deleted successfully!', 'success');
        loadAdminProjects();
        loadProjects();
        updateStats();
    } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Error deleting project', 'error');
    }
};

window.editBlog = (id) => {
    showNotification('Edit functionality coming soon!', 'info');
};

window.deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
        await db.collection('blogs').doc(id).delete();
        showNotification('Blog post deleted successfully!', 'success');
        loadAdminBlogs();
        loadBlogs();
        updateStats();
    } catch (error) {
        console.error('Error deleting blog post:', error);
        showNotification('Error deleting blog post', 'error');
    }
};

function exportData() {
    showLoadingState('Exporting data...');
    
    // Simulate data export
    setTimeout(() => {
        const data = {
            projects: [],
            blogs: [],
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
        hideLoadingState();
    }, 2000);
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        clearFormErrors(formId);
        showNotification('Form reset successfully!', 'info');
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear form errors when closing modal
    const form = modal.querySelector('form');
    if (form) {
        clearFormErrors(form.id);
    }
}

async function loadContent() {
    await Promise.all([
        loadProjects(),
        loadBlogs()
    ]);
}

async function loadProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    const loadingState = document.getElementById('projectsLoading');
    
    try {
        // Show loading state
        if (loadingState) {
            loadingState.style.display = 'flex';
        }
        
        const snapshot = await db.collection('projects')
            .orderBy('createdAt', 'desc')
            .get();
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (snapshot.empty) {
            projectsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; opacity: 0.6;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
                    <p style="color: var(--text-secondary);">No projects added yet. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        projectsContainer.innerHTML = '';
        
        snapshot.forEach((doc, index) => {
            const project = doc.data();
            const projectCard = createProjectCard(project, index + 1);
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Show fallback content instead of error
        projectsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; opacity: 0.6;">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
                <p style="color: var(--text-secondary);">Projects will appear here soon!</p>
            </div>
        `;
    }
}

function createProjectCard(project, number) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    card.innerHTML = `
        <div class="project-image">
            <span class="project-number">${String(number).padStart(2, '0')}</span>
            <i class="fas fa-code project-icon"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <p class="project-tech">${project.technologies}</p>
            ${project.url ? `
                <a href="${project.url}" target="_blank" class="btn btn-outline">
                    <span>View Project</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>
            ` : ''}
        </div>
    `;
    
    // Animate card appearance
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, number * 100);
    
    return card;
}

async function loadBlogs() {
    const blogContainer = document.getElementById('blogContainer');
    const loadingState = document.getElementById('blogLoading');
    
    try {
        // Show loading state
        if (loadingState) {
            loadingState.style.display = 'flex';
        }
        
        const snapshot = await db.collection('blogs')
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get();
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (snapshot.empty) {
            blogContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; opacity: 0.6;">
                    <i class="fas fa-pen-fancy" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
                    <p style="color: var(--text-secondary);">No blog posts yet. Stay tuned for insights!</p>
                </div>
            `;
            return;
        }
        
        blogContainer.innerHTML = '';
        
        snapshot.forEach((doc, index) => {
            const blog = doc.data();
            const blogCard = createBlogCard(blog, index);
            blogContainer.appendChild(blogCard);
        });
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Show fallback content instead of error
        blogContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; opacity: 0.6;">
                <i class="fas fa-pen-fancy" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
                <p style="color: var(--text-secondary);">Blog posts will appear here soon!</p>
            </div>
        `;
    }
}

function createBlogCard(blog, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    const date = blog.createdAt ? 
        new Date(blog.createdAt.toDate()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Recent';
    
    const excerpt = blog.excerpt || (blog.content.length > 150 ? 
        blog.content.substring(0, 150) + '...' : 
        blog.content);
    
    card.innerHTML = `
        <p class="blog-date">${date}</p>
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-excerpt">${excerpt}</p>
        <div class="blog-tags">
            ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
    `;
    
    // Animate card appearance
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, (index + 1) * 100);
    
    return card;
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 type === 'warning' ? 'exclamation-triangle' :
                 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function showLoadingState(message) {
    if (isLoading) return;
    isLoading = true;
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 40px; height: 40px; border: 3px solid var(--border); border-top: 3px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="font-family: var(--font-primary); font-size: 0.9rem; color: var(--text-secondary); letter-spacing: 0.05em;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
}

function hideLoadingState() {
    isLoading = false;
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 300);
    }
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showFormError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            }, 0);
        });
    }
}

// Error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Initialize performance monitoring
logPerformance();

// Initialize content loading
window.addEventListener('load', () => {
    loadContent();
});
