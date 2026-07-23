// --- Global Elements ---
const playBtn = document.getElementById('play-btn');
const bgMusicLock = document.getElementById('bg-music-lock');
const bgMusicInside = document.getElementById('bg-music-inside');
let isPlaying = false;

// Safely initialize Lucide Icons
function initIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn('Lucide icons could not be loaded.');
    }
}
initIcons();

// --- Background Hearts Generation ---
function createHearts() {
    const bgHearts = document.getElementById('bg-hearts');
    if (!bgHearts) return;
    const heartCount = 20;

    for (let i = 0; i < heartCount; i++) {
        let heart = document.createElement('div');
        heart.classList.add('heart-particle');
        
        // Randomize position, size, and animation duration
        let size = Math.random() * 15 + 10;
        let left = Math.random() * 100;
        let animDuration = Math.random() * 10 + 10;
        let delay = Math.random() * 10;

        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        heart.style.left = left + 'vw';
        heart.style.animationDuration = animDuration + 's';
        heart.style.animationDelay = delay + 's';

        bgHearts.appendChild(heart);
    }
}
createHearts();

// --- Time Lock Logic ---
const unlockDate = new Date('2026-07-24T00:01:00'); 
const openBtn = document.getElementById('open-btn');
const lockScreen = document.getElementById('lock-screen');
const countdownEl = document.getElementById('countdown');
let isLocked = true;

function updateLock() {
    const now = new Date();
    const diff = unlockDate - now;

    if (diff <= 0) {
        // Unlock time reached!
        isLocked = false;
        if (openBtn) {
            openBtn.classList.remove('locked');
            openBtn.innerHTML = 'Click to Open <span class="heart-icon">❤️</span>';
        }
        if (lockScreen) {
            lockScreen.style.display = 'none'; // Hide countdown entirely
        }
        return;
    }

    // Time calculations for countdown
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (countdownEl) {
        countdownEl.innerHTML = `
            <div class="cd-box"><span class="cd-val">${days}</span><span class="cd-label">Days</span></div>
            <div class="cd-box"><span class="cd-val">${hours.toString().padStart(2, '0')}</span><span class="cd-label">Hrs</span></div>
            <div class="cd-box"><span class="cd-val">${minutes.toString().padStart(2, '0')}</span><span class="cd-label">Min</span></div>
            <div class="cd-box"><span class="cd-val">${seconds.toString().padStart(2, '0')}</span><span class="cd-label">Sec</span></div>
        `;
    }
}

// Check lock every second
setInterval(updateLock, 1000);
updateLock(); // Initial call


// --- Card Flip Logic ---
const cardCover = document.getElementById('card-cover');
const cardInside = document.getElementById('card-inside');

if (openBtn) {
    openBtn.addEventListener('click', () => {
        if (isLocked) return; // Do nothing if locked
        
        // Start flip animation
        if (cardCover) cardCover.classList.add('open-anim');
        
        // Transition Music
        if (bgMusicLock) {
            bgMusicLock.pause();
            bgMusicLock.currentTime = 0;
        }
        if (bgMusicInside) {
            bgMusicInside.play().then(() => {
                isPlaying = true;
                if (playBtn) {
                    playBtn.innerHTML = '<i data-lucide="pause" fill="white" color="white"></i>';
                    playBtn.classList.add('playing');
                    initIcons();
                }
            }).catch(e => {});
        }
        
        // Show transition screen after a slight delay
        setTimeout(() => {
            if (cardCover) cardCover.style.display = 'none';
            const transitionScreen = document.getElementById('transition-countdown');
            const transitionNum = document.getElementById('transition-number');
            
            if (transitionScreen && transitionNum) {
                transitionScreen.classList.remove('hidden');
                let count = 5;
                transitionNum.innerText = count;
                
                const interval = setInterval(() => {
                    count--;
                    if (count > 0) {
                        transitionNum.innerText = count;
                    } else {
                        clearInterval(interval);
                        transitionScreen.classList.add('hidden');
                        setTimeout(() => {
                            if (cardInside) cardInside.classList.remove('hidden');
                        }, 500); // Wait for transition fade out
                    }
                }, 1000);
            } else {
                if (cardInside) cardInside.classList.remove('hidden');
            }
        }, 400); 
    });
}

// --- Page Navigation Logic ---
let currentPage = 0;
const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');

function showPage(index) {
    if (pages.length === 0) return;
    
    // Hide all pages and deactivate dots
    pages.forEach(p => p.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Show current page
    if (pages[index]) pages[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

// Make changePage globally available for HTML onclick attribute
window.changePage = function(direction) {
    currentPage += direction;
    
    // Loop around
    if (currentPage >= pages.length) currentPage = 0;
    if (currentPage < 0) currentPage = pages.length - 1;
    
    showPage(currentPage);
}


// --- Audio Player Logic ---

if (playBtn && bgMusicInside) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusicInside.pause();
            playBtn.innerHTML = '<i data-lucide="play" fill="white" color="white"></i>';
            playBtn.classList.remove('playing');
        } else {
            bgMusicInside.play();
            playBtn.innerHTML = '<i data-lucide="pause" fill="white" color="white"></i>';
            playBtn.classList.add('playing');
        }
        initIcons(); // Re-initialize icons
        isPlaying = !isPlaying;
    });
}

// --- Secret Bypass Logic ---
function triggerUnlockPrompt() {
    if (isLocked) {
        const pass = prompt('Enter password:');
        if (pass === '272048') {
            isLocked = false;
            if (lockScreen) lockScreen.style.display = 'none';
            if (openBtn) {
                openBtn.classList.remove('locked');
                openBtn.innerHTML = 'Click to Open <span class="heart-icon">❤️</span>';
                // Automatically open the card
                openBtn.click();
            }
        } else if (pass !== null) {
            alert('Incorrect password!');
        }
    }
}

const secretBtn = document.getElementById('secret-btn');
if (secretBtn) {
    secretBtn.addEventListener('click', triggerUnlockPrompt);
}

// Allow pressing 'Enter' key anywhere to trigger the prompt
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (isLocked) {
            triggerUnlockPrompt();
        }
        // Try playing lock music on Enter if locked
        if (isLocked && bgMusicLock && bgMusicLock.paused) {
            bgMusicLock.play().catch(e => {});
        }
    }
});

// Try playing lock music on any click anywhere
document.addEventListener('click', () => {
    if (isLocked && bgMusicLock && bgMusicLock.paused) {
        bgMusicLock.play().catch(e => {});
    }
});

// --- Auto-play Audio Logic ---
// Try to automatically play lock music 5 seconds after entering the website
setTimeout(() => {
    if (isLocked && bgMusicLock && bgMusicLock.paused) {
        bgMusicLock.play().catch(e => {
            console.log('Autoplay was blocked by the browser. The user needs to interact with the document first.');
        });
    }
}, 5000);

// --- Spam Heart Button Logic ---
const spamHeartBtn = document.getElementById('spam-heart-btn');
let currentSpamHearts = 0;
const MAX_SPAM_HEARTS = 40; // Max hearts on screen to prevent lag

function doSpamHeart(e) {
    if (e && e.stopPropagation) e.stopPropagation(); 
    
    // Play lock music if not playing yet
    if (isLocked && bgMusicLock && bgMusicLock.paused) {
        bgMusicLock.play().catch(err => {});
    }
    
    if (currentSpamHearts >= MAX_SPAM_HEARTS) return; // Limit hearts
    
    currentSpamHearts++;
    
    const heart = document.createElement('div');
    heart.classList.add('spam-heart');
    
    // Array of cute emojis
    const emojis = ['💖', '💕', '🥰', '❤️', '✨'];
    heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px'; // 20px to 40px
    
    let startX, startY;
    
    if (spamHeartBtn) {
        // Position relative to button
        const btnRect = spamHeartBtn.getBoundingClientRect();
        startX = btnRect.left + (btnRect.width / 2) + (Math.random() * 60 - 30);
        startY = btnRect.top + (Math.random() * 20 - 10);
    } else {
        // Fallback to center screen if button not found
        startX = window.innerWidth / 2 + (Math.random() * 60 - 30);
        startY = window.innerHeight / 2 + (Math.random() * 20 - 10);
    }
    
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';
    
    // Random slight rotation for variety
    heart.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    
    document.body.appendChild(heart);
    
    // Cleanup after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
            currentSpamHearts--;
        }
    }, 2000);
}

if (spamHeartBtn) {
    // Add multiple event listeners to ensure it works across all devices
    spamHeartBtn.addEventListener('click', doSpamHeart);
    spamHeartBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double firing with click
        doSpamHeart(e);
    });
}

// Global keydown for Enter to unlock and Spacebar to spam hearts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (isLocked) {
            triggerUnlockPrompt();
        }
        // Try playing lock music on Enter if locked
        if (isLocked && bgMusicLock && bgMusicLock.paused) {
            bgMusicLock.play().catch(err => {});
        }
    }
    if (e.code === 'Space' || e.key === ' ') {
        if (isLocked) {
            e.preventDefault(); // Prevent scrolling down the page
            doSpamHeart(e);
        }
    }
});
// --- Relationship Timer Logic ---
const relTimer = document.getElementById('rel-timer');
const startDate = new Date('2025-07-24T00:00:00'); // 1 year before 2026-07-24

function updateRelationshipTimer() {
    if (!relTimer) return;
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) {
        relTimer.innerHTML = 'Waiting for our journey to begin...';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    relTimer.innerHTML = `อยู่ด้วยกันมาแล้ว: ${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที 💖`;
}
if (relTimer) {
    setInterval(updateRelationshipTimer, 1000);
    updateRelationshipTimer();
}

// --- Audio Progress Bar Logic ---
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

if (bgMusicInside && progressBar && progressContainer) {
    bgMusicInside.addEventListener('timeupdate', () => {
        if (!isNaN(bgMusicInside.duration)) {
            const percent = (bgMusicInside.currentTime / bgMusicInside.duration) * 100;
            progressBar.style.width = percent + '%';
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        bgMusicInside.currentTime = pos * bgMusicInside.duration;
    });
}
