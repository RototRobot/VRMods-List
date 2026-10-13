// --- Header Notice Dismissal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const notice = document.getElementById('site-notice');
    const dismissBtn = document.getElementById('site-notice-dismiss');

    if (sessionStorage.getItem('vrModsNoticeDismissed') === 'true') {
        if (notice) notice.style.display = 'none';
    }

    if (dismissBtn && notice) {
        dismissBtn.addEventListener('click', () => {
            notice.style.display = 'none';
            sessionStorage.setItem('vrModsNoticeDismissed', 'true');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Selector is correct based on your final HTML structure
    const filterButtons = document.querySelectorAll('#filter-buttons-group .filter-btn');
    const clearAllButton = document.querySelector('#clear-all-btn');
    const gameItems = document.querySelectorAll('#game-grid .game-item');
    
    // 1. SELECT THE NEW ELEMENT
    const gameCountElement = document.querySelector('#game-count'); 

    // This function will run every time a button is clicked
    const filterGames = () => {
        // Collect all filters into separate arrays based on their state
        const inclusionFilters = [];
        const exclusionFilters = [];

        filterButtons.forEach(button => {
            if (button.classList.contains('active')) {
                inclusionFilters.push(button.dataset.genre);
            } else if (button.classList.contains('exclude')) {
                exclusionFilters.push(button.dataset.genre);
            }
        });

        const hasActiveFilters = inclusionFilters.length > 0 || exclusionFilters.length > 0;
        
        // 2. INITIALIZE A COUNTER
        let visibleCount = 0; 

        // Loop through every game item
        gameItems.forEach(item => {
            const itemTags = item.dataset.tags ? item.dataset.tags.split(' ') : [];

            // 1. If no filters are active at all, show all games
            if (!hasActiveFilters) {
                item.classList.remove('hide');
                // 3. INCREMENT COUNTER
                visibleCount++;
                return;
            }

            // 2. Check Inclusionary Filters (MUST have ALL of these tags)
            const passesInclusion = inclusionFilters.every(filter => itemTags.includes(filter));

            // 3. Check Exclusionary Filters (MUST NOT have ANY of these tags)
            const failsExclusion = exclusionFilters.some(filter => itemTags.includes(filter));

            // 4. Final Decision
            if (passesInclusion && !failsExclusion) {
                item.classList.remove('hide'); // Show it
                // 3. INCREMENT COUNTER
                visibleCount++;
            } else {
                item.classList.add('hide');   // Hide it
            }
        });
        
        // 4. UPDATE THE DISPLAYED COUNT AFTER ALL ITEMS HAVE BEEN PROCESSED
        if (gameCountElement) {
            gameCountElement.textContent = `${visibleCount} item${visibleCount !== 1 ? 's' : ''} visible`;
        }
    };
        
    // Clears all active filters and re-runs filterGames
    const clearFilters = () => {
        filterButtons.forEach(button => {
            button.classList.remove('active');
            button.classList.remove('exclude');
        });
        filterGames();
    };

    // --- BUTTON EVENT LISTENERS (THREE-STATE LOGIC) ---

    // Add a click listener to EACH regular filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check current state and transition to the next state

            if (button.classList.contains('active')) {
                // State 1 (Active/Include) -> State 2 (Exclude)
                button.classList.remove('active');
                button.classList.add('exclude');
            } else if (button.classList.contains('exclude')) {
                // State 2 (Exclude) -> State 3 (Off/Default)
                button.classList.remove('exclude');
                // No class change needed, it's now back to default
            } else {
                // State 3 (Off/Default) -> State 1 (Active/Include)
                button.classList.add('active');
            }

            // Re-run the filter logic
            filterGames();
        });
    });

    // Add a click listener to the Clear All button, but only if it exists
    if (clearAllButton) {
        clearAllButton.addEventListener('click', clearFilters);
    }
    
    // 5. RUN FILTERS ON PAGE LOAD to set the initial count!
    filterGames();

});
            
        // This JavaScript makes the game card info box expand
        document.addEventListener('DOMContentLoaded', function() {
            // Select all expand buttons
            const expandButtons = document.querySelectorAll('.expand-btn');

            expandButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    // 1. STOP the click from activating the main <a> tag link
                    event.preventDefault(); 
                    event.stopPropagation();

                    // 2. Find the main game item container
                    const gameItem = button.closest('.game-item');

                    // 3. Toggle the expanded class
                    gameItem.classList.toggle('is-expanded');

                    // 4. Update the ARIA state for accessibility
                    const isExpanded = gameItem.classList.contains('is-expanded');
                    button.setAttribute('aria-expanded', isExpanded);
                });
            });
        });      

    // This JavaScript handles the sidebar toggle
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.getElementById('menu-toggle');
        const closeButton = document.querySelector('.sidebar .close-btn');
        const sidebar = document.getElementById('sidebar-menu');

        function toggleMenu() {
            // Toggle class on the BODY element
            const isOpen = document.body.classList.toggle('sidebar-is-open');
            
            // Update ARIA on the toggle button
            toggleButton.setAttribute('aria-expanded', isOpen);
        }

        // Open menu when hamburger is clicked
        toggleButton.addEventListener('click', toggleMenu);

        // Close menu when X is clicked
        closeButton.addEventListener('click', toggleMenu);
    });

    document.addEventListener('DOMContentLoaded', () => {

    // --- NEW SCROLL TO TOP FUNCTIONALITY ---

    const scrollBtn = document.getElementById("scrollToTopBtn");

    // Function to check scroll position and toggle button visibility
    const scrollFunction = () => {
        // Show the button if the user has scrolled down 300 pixels
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    };

const topFunction = () => {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Adjust for speed (in milliseconds)
    let startTimestamp = null;

    // Easing function: "Ease In Out Quad"
    // This makes it slow at start/end and faster in the middle
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        
        // Calculate the next scroll position
        const nextScroll = easeInOutQuad(elapsed, startPosition, distance, duration);
        
        window.scrollTo(0, nextScroll);

        if (elapsed < duration) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, targetPosition); // Ensure we land exactly at 0
        }
    };

    window.requestAnimationFrame(step);
};

    // 1. Add event listener for when the user scrolls
    window.onscroll = scrollFunction;

    // 2. Add event listener for when the button is clicked
    if (scrollBtn) {
        scrollBtn.addEventListener('click', topFunction);
    }
    });

// --- Content Loading Function ---
    async function loadMainContent() {
        try {
            const response = await fetch('main-content.html');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const htmlContent = await response.text();
            const mainContentEl = document.getElementById('main-content');

            if (mainContentEl) {
                mainContentEl.innerHTML = htmlContent;

                initFilterButtons();
                initExpandButtons();
            }

        } catch (error) {
            console.error('Could not load main content:', error);
            document.getElementById('main-content').innerHTML = '<p style="color: white; text-align: center;">Error: Could not load game list.</p>';
        }
    }
    document.addEventListener('DOMContentLoaded', function() {

        function closeCurrentPanel() {
            const existingPanel = document.querySelector('.details-panel');
            if (existingPanel) existingPanel.remove();
            document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-parent'));
        }

        function createPanel(data) {
            const div = document.createElement('div');
            div.className = 'details-panel';

                // We build the secondary button HTML *only* if the data exists
            const secondaryButtonHTML = data.secLink ? `
                    <a href="${data.secLink}" target="_blank" class="filter-btn active" style="text-decoration:none; display:inline-block; border:none; box-shadow: 0 4px 15px rgba(39, 108, 245, 0.4);">
                        ${data.secText || "View Alternate Version"}
                    </a>
            ` : '';

            div.innerHTML = `
                <div class="details-hero-bg" style="background-image: url('${data.bgSrc}');"></div>

                <div class="details-panel-content">
                    <h2 style="line-height: 1.1; margin-bottom: 15px;">
                        <div style="font-size: 1em; display: block;">${data.titleMain}</div>
                        <div style="font-size: 0.5em; color: #276CF5; font-weight: 400; margin-top: 8px; text-shadow: none;">
                            ${data.titleSub}
                        </div>
                    </h2>
                    <p class="game-desc">${data.desc}</p>

                    <div class="details-stats-grid">
                        <div class="stat-item"><strong>Genres</strong> ${data.genres}</div>
                        <div class="stat-item"><strong>Playtime</strong> ${data.playtime}</div>
                        <div class="stat-item"><strong>Co-op / PvP</strong> ${data.multiplayer}</div>
                        <div class="stat-item"><strong>Comfort Level</strong> ${data.comfort}</div>
                    </div>

                    <div style="margin-top: 25px; display: flex; flex-wrap: wrap; gap: 15px;">
                        <a href="${data.link}" target="_blank" class="filter-btn active" style="text-decoration:none; display:inline-block; border:none; box-shadow: 0 4px 15px rgba(39, 108, 245, 0.4);">
                            View Mod Page
                        </a>

                        ${secondaryButtonHTML} 
                    </div>
                </div>
            `;
            return div;
        }

        const gameGrid = document.getElementById('game-grid');

        gameGrid.addEventListener('click', function(e) {
            const item = e.target.closest('.game-item');
            if (!item) return;

            e.preventDefault();

            if (item.classList.contains('active-parent')) {
                closeCurrentPanel();
                return;
            }

            closeCurrentPanel();
            item.classList.add('active-parent');

            const infoBlock = item.querySelector('.game-info-hidden');
            if (!infoBlock) return;

            const thumbSrc = item.querySelector('img').src;
            const bgSpan = infoBlock.querySelector('.data-bg');
            const bgSrc = bgSpan ? bgSpan.innerText : thumbSrc;

                // NEW: Check for the secondary link span
            const secLinkSpan = infoBlock.querySelector('.data-secondary-link');

            const data = {
                // Separate the main title and modder info
                titleMain: item.querySelector('.title-main').innerText,
                titleSub: item.querySelector('.title-sub').innerText,
                
                link: item.querySelector('a').href,
                bgSrc: bgSrc, 
                desc: infoBlock.querySelector('.data-desc').innerHTML,
                genres: infoBlock.querySelector('.data-genres').innerText,
                playtime: infoBlock.querySelector('.data-playtime').innerText,
                multiplayer: infoBlock.querySelector('.data-multiplayer').innerText,
                comfort: infoBlock.querySelector('.data-comfort').innerText,

                secLink: secLinkSpan ? secLinkSpan.dataset.url : null,
                secText: secLinkSpan ? secLinkSpan.dataset.text : null
            };

            const panel = createPanel(data);

            // (Grid Injection Logic)
            const visibleItems = Array.from(gameGrid.querySelectorAll('.game-item:not(.hide)'));
            const index = visibleItems.indexOf(item);
            const gridComputedStyle = window.getComputedStyle(gameGrid);
            const gridColumnValue = gridComputedStyle.getPropertyValue('grid-template-columns');
            const itemsPerRow = gridColumnValue.split(' ').length;

            const rowNumber = Math.floor(index / itemsPerRow);
            let lastItemIndex = (rowNumber + 1) * itemsPerRow - 1;

            if (lastItemIndex >= visibleItems.length) lastItemIndex = visibleItems.length - 1;

            const referenceNode = visibleItems[lastItemIndex];
            referenceNode.parentNode.insertBefore(panel, referenceNode.nextSibling);

            setTimeout(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.addEventListener('click', closeCurrentPanel));
    });