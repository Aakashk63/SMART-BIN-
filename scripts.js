document.addEventListener('DOMContentLoaded', () => {

    // Particle Background Generator (Simple lightweight dots)
    const createParticles = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-js';
        document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particlesArray = [];
        for (let i = 0; i < 50; i++) {
            particlesArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speedY: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => {
                ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                p.y -= p.speedY; // float up
                if (p.y < 0) p.y = canvas.height;
            });
            requestAnimationFrame(animate);
        }
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };
    
    // Only run particles if not on map page to save performance
    if(!document.getElementById('map')) {
        createParticles();
    }

    // Live Clock for Dashboard HUD
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false }) + " IST";
        }, 1000);
    }

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });

    // Scanner Upload Mock
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
             // Create fake file input
             const fileInput = document.createElement('input');
             fileInput.type = 'file';
             fileInput.accept = 'image/*';
             fileInput.onchange = (e) => {
                 if (e.target.files && e.target.files[0]) {
                     runScanner(e.target.files[0].name);
                 }
             };
             fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--neon-blue)';
        });
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 212, 255, 0.5)';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                runScanner(e.dataTransfer.files[0].name);
            }
        });
        
        function runScanner(fileName) {
            uploadArea.classList.add('scanning');
            uploadArea.innerHTML = `
                <div class="scanner-line"></div>
                <i class="fa-solid fa-microchip upload-icon text-glow-blue" style="animation: pulseGlow 1s infinite;"></i>
                <p class="mono text-glow-blue">ANALYZING: ${fileName}</p>
                <div class="data-bar" style="max-width: 200px; margin: 1rem auto; height: 4px;">
                    <div class="data-fill" style="width: 0%; transition: width 2s cubic-bezier(0.1, 0.7, 1.0, 0.1);"></div>
                </div>
            `;
            
            setTimeout(() => { document.querySelector('.data-fill').style.width = '100%'; }, 100);
            
            setTimeout(() => {
                uploadArea.classList.remove('scanning');
                uploadArea.style.borderColor = 'var(--neon-red)';
                uploadArea.style.background = 'rgba(255, 42, 42, 0.05)';
                uploadArea.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: var(--neon-red); text-shadow: 0 0 10px red; margin-bottom: 1rem;"></i>
                    <p class="mono" style="color: var(--neon-red);">AI PREDICTION: FULL BIN</p>
                    <p class="mono" style="font-size: 0.75rem; color: var(--text-muted); margin-top:0.5rem;">CONFIDENCE: 98.4%</p>
                `;
                const statusSelect = document.getElementById('status');
                if (statusSelect) statusSelect.value = 'full';
            }, 2100);
        }
    }

    // Auto-locate mock
    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
             const input = document.getElementById('location');
             locateBtn.innerHTML = '<i class="fa-solid fa-satellite-dish fa-spin"></i> UPLINKING...';
             setTimeout(() => {
                 input.value = "100ft Road, Indiranagar, Bengaluru [COORD: 12.978, 77.638]";
                 locateBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> SYNCED';
                 locateBtn.classList.replace('btn-secondary', 'btn-success');
             }, 1200);
        });
    }

    // Route Optimization HUD Mock
    const optimizeBtn = document.getElementById('optimize-btn');
    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', () => {
            const originalText = optimizeBtn.innerHTML;
            optimizeBtn.innerHTML = '<i class="fa-solid fa-microchip"></i> CALCULATING NEURAL PATH...';
            optimizeBtn.style.pointerEvents = 'none';
            
            let dots = 0;
            const interval = setInterval(() => {
                const loadingBar = document.getElementById('route-loading-bar');
                if(loadingBar) {
                    loadingBar.style.display = 'block';
                    loadingBar.querySelector('.data-fill').style.width = `${Math.min(100, Math.random() * 100)}%`;
                }
            }, 300);
            
            setTimeout(() => {
                clearInterval(interval);
                const loadingBar = document.getElementById('route-loading-bar');
                if(loadingBar) {
                    loadingBar.querySelector('.data-fill').style.width = '100%';
                    loadingBar.querySelector('.data-fill').classList.add('green');
                }
                
                optimizeBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> PATH OPTIMIZED';
                optimizeBtn.classList.replace('btn-primary', 'btn-success');
                
                const statsDiv = document.getElementById('route-stats');
                if (statsDiv) {
                    statsDiv.style.display = 'block';
                    statsDiv.style.opacity = '1';
                }
                
                document.dispatchEvent(new CustomEvent('routeOptimized'));
            }, 2500);
        });
    }
});
