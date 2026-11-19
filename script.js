// Dark / Light Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

if (localStorage.getItem('theme') === 'light') {
    htmlElement.classList.remove('dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
} else {
    htmlElement.classList.add('dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Project Filter
function filterProjects(category, btnEl) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 transition';
    });
    btnEl.className = 'filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white transition';

    document.querySelectorAll('.project-card').forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (category === 'all' || categories.includes(category)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Copy Phone Helper
function copyPhone() {
    navigator.clipboard.writeText('+919569735825');
    const toast = document.getElementById('copy-toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
}

// Project Architecture Modal Data
const projectData = {
    gym: {
        tag: "2026 • Project",
        title: "Gym Membership Management System",
        summary: "Full-stack Gym Membership Management System for member registration, membership management, class management, and analytics.",
        points: [
            "Implemented member registration, membership management, class management, dashboard statistics and member search.",
            "Added dashboard statistics for members, revenue and attendance tracking.",
            "Built RESTful API endpoints for member and class operations.",
            "Used Express.js middleware for JSON and form data and Mongoose for structured data management."
        ],
        stack: ["HTML/CSS", "Node.js", "MongoDB", "JavaScript", "Express.js", "Mongoose", "GitHub"],
        github: "https://github.com/prakhar987654321"
    },
    hospital: {
        tag: "2026 • Project",
        title: "Hospital Bed and Blood Bank Availability",
        summary: "Web-based platform to check hospital bed and blood bank availability in real time.",
        points: [
            "Implemented features to check general beds, ICU beds, ventilators and blood group availability.",
            "Added functionality to register and manage hospital information within the system.",
            "Designed a centralized interface for accessing hospital and blood bank resources efficiently.",
            "Improved accessibility by organizing availability information in a simple and user-friendly format."
        ],
        stack: ["HTML/CSS", "Node.js", "MongoDB", "JavaScript", "Express.js", "Mongoose", "GitHub"],
        github: "https://github.com/prakhar987654321"
    },
    portfolio: {
        tag: "2026 • Project",
        title: "Full-Stack Developer Portfolio",
        summary: "Portfolio showcasing projects with interactive project architecture modals and automated Git CI/CD deployment.",
        points: [
            "Developed interactive project architecture modals using HTML5, Tailwind CSS, JavaScript, Node.js, Express, and MongoDB.",
            "Deployed live with automated Git CI/CD.",
            "Supports both localhost and Vercel static deployment seamlessly."
        ],
        stack: ["HTML/CSS", "Node.js", "MongoDB", "JavaScript", "Express.js", "Mongoose", "REST APIs", "GitHub"],
        github: "https://github.com/prakhar987654321"
    }
};

function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;
    document.getElementById('modal-tag').textContent = data.tag;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-summary').textContent = data.summary;
    document.getElementById('modal-points').innerHTML = data.points.map(pt => `<li>${pt}</li>`).join('');
    document.getElementById('modal-stack').innerHTML = data.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    document.getElementById('modal-github').href = data.github;

    const modal = document.getElementById('project-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') closeProjectModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
});
