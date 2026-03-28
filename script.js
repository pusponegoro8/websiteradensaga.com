// script.js - Full interactivity untuk website pribadi lengkap
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => nav.classList.toggle('show'));

  // Smooth scroll & close mobile nav
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('show');
    });
  });

  // Theme toggle (dark/light)
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') body.classList.add('light');
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
  });
  themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

  // Load projects dynamically dari projects.json
  fetch('projects.json')
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById('projectsGrid');
      data.projects.forEach(p => {
        const el = document.createElement('div');
        el.className = 'project-card';
        el.innerHTML = `
          <h4>${p.title}</h4>
          <p class="muted">${p.tags.join(' • ')}</p>
          <p>${p.description}</p>
          <p><a href="${p.url}" target="_blank" rel="noopener" class="read-more">Lihat Demo →</a></p>
        `;
        grid.appendChild(el);
      });
    })
    .catch(() => {
      // Fallback projects jika JSON gagal
      const grid = document.getElementById('projectsGrid');
      grid.innerHTML = `
        <div class="project-card">
          <h4>Ecommerce Toko Online</h4><p class="muted">PHP/MySQL</p><p>Toko lengkap dengan cart/checkout.</p><p><a href="../ecommerce/" target="_blank" class="read-more">Live Demo</a></p>
        </div>
        <div class="project-card">
          <h4>Sistem Absensi</h4><p class="muted">PHP/QR</p><p>Absensi digital sekolah.</p><p><a href="../absensi_project_full_v2/" target="_blank" class="read-more">Live Demo</a></p>
        </div>
      `;
    });

  // Contact form - simpan local (demo) + WA redirect
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const clearBtn = document.getElementById('clearBtn');
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    // Simpan local
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({...data, timestamp: new Date().toLocaleString('id-ID')});
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Update status
    status.innerHTML = `✅ Pesan dari <strong>${data.name}</strong> tersimpan! <br>Terima kasih! Hubungi via WA juga ya.`;
    status.style.color = 'var(--accent)';
    form.reset();
    
    // Optional: auto-scroll ke WA dengan pesan
    setTimeout(() => {
      if (confirm('Buka WhatsApp sekarang?')) {
        const msg = `Halo Raden! Nama: ${data.name}%0ASubjek: ${data.message.substring(0,50)}...`;
        window.open(`https://wa.me/6281249366349?text=${msg}`);
      }
    }, 2000);
  });
  
  clearBtn.addEventListener('click', () => {
    form.reset();
    status.textContent = '';
  });

  // Auto-update year footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Intersection Observer untuk fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });
  document.querySelectorAll('.service-card, .project-card, .social-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(el);
  });
});
