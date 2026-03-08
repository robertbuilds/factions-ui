    const rankConfig = {
        "manager": { badgeClass: "manager-badge", nameClass: "manager-name", icon: "fa-user-tie", label: "Manager" },
        "leader": { badgeClass: "leader-badge", nameClass: "leader-name", icon: "fa-crown", label: "Leader" },
        "co-leader": { badgeClass: "co-leader-badge", nameClass: "co-leader-name", icon: "fa-shield", label: "Co-Leader" },
        "tester": { badgeClass: "tester-badge", nameClass: "tester-name", icon: "fa-magnifying-glass", label: "Tester" }
    };

    const factionMembers = {
        "lspd": {
            applicationsOpen: true,
            manager: { name: "Kaos", online: true },
            staff: [
                { name: "KeTeX", rank: "leader", online: true },
                { name: "rowly", rank: "co-leader", online: false },
                { name: "KeTeX", rank: "leader", online: true },
                { name: "rowly", rank: "co-leader", online: false },
                { name: "KeTeX", rank: "leader", online: true },
                { name: "iusteeN", rank: "co-leader", online: false },
                { name: "KeTeX", rank: "leader", online: true },
                { name: "rowly", rank: "co-leader", online: false },
                { name: "SilyMike", rank: "tester", online: true }
            ]
        },
        "hitman": {
            applicationsOpen: false,
            manager: { name: "RobertxD", online: false },
            staff: [
                { name: "Davidd", rank: "leader", online: true },
                { name: "Lamba", rank: "co-leader", online: false },
                { name: "Davidd", rank: "leader", online: true },
                { name: "Lamba", rank: "co-leader", online: false },
                { name: "Davidd", rank: "leader", online: true },
                { name: "Lamba", rank: "co-leader", online: false },
                { name: "Cartof", rank: "tester", online: false }    
            ]
        },
        "ttc": {
            applicationsOpen: false,
            manager: { name: "hasalf", online: true },
            staff: [
                { name: "Bunicul", rank: "leader", online: false },
                { name: "Tele", rank: "co-leader", online: true },
                { name: "laarissaa", rank: "tester", online: false }
            ]
        },
        "taxi": {
            applicationsOpen: true,
            manager: { name: "AlexMatew", online: false },
            staff: [
                { name: "C_Jay", rank: "leader", online: false },
                { name: "raGGaBAws", rank: "co-leader", online: true },
                { name: "C_Jay", rank: "leader", online: false },
                { name: "raGGaBAws", rank: "co-leader", online: true },
                { name: "C_Jay", rank: "leader", online: false },
                { name: "raGGaBAws", rank: "co-leader", online: true },
                { name: "PiqueS", rank: "tester", online: true }
            ]
        },
        "swat": {
            applicationsOpen: false,
            manager: { name: "No One", online: false },
            staff: [
                { name: "No One", rank: "leader", online: false },
                { name: "Test2", rank: "co-leader", online: false },
                { name: "Test3", rank: "tester", online: true}
            ]
        },
        "ballas": {
            applicationsOpen: true,
            manager: { name: "Archer", online: true },
            staff: [
                { name: "lava", rank: "leader", online: false },
                { name: "LuisVasile24", rank: "co-leader", online: true },
                { name: "Cartof", rank: "tester", online: true}
            ]
        },
        "los-vagos": {
            applicationsOpen: false,
            manager: { name: "Andi", online: true },
            staff: [
                { name: "Geo7", rank: "leader", online: false },
                { name: "Citiregu", rank: "co-leader", online: false },
                { name: "K3zR", rank: "tester", online: true }
            ]
        },
        "grove-street": {
            applicationsOpen: false,
            manager: { name: "Archer", online: true },
            staff: [
                { name: "Dulciku", rank: "leader", online: false },
                { name: "PRiNCE", rank: "co-leader", online: true },
                { name: "nusuntallex", rank: "tester", online: false}
            ]
        },
        "los-aztecas": {
            applicationsOpen: false,
            manager: { name: "Andi", online: true },
            staff: [
                { name: "Marquez", rank: "leader", online: true },
                { name: "bkm", rank: "co-leader", online: false },
                { name: "palboy", rank: "tester", online: false}
            ]
        }
    };

    const factionNames = {
        'lspd': 'Los Santos Police Department', 'hitman': 'Hitman Agency', 'ttc': 'Tow Truck Company', 
        'taxi': 'Taxi Company', 'swat': 'SWAT.', 'ballas': 'Ballas', 
        'los-vagos': 'Los Vagos', 'grove-street': 'Grove Street', 'los-aztecas': 'Los Aztecas'
    };

    document.addEventListener('DOMContentLoaded', () => {
        updateLeaderNames();
        updateApplicationStatus();
        animateCapacityAndMembers();
        
        const MAX_TILT_ANGLE = 7; 

        function applyTilt(cardElement) {
            cardElement.style.transformOrigin = 'center center';
            cardElement.style.backfaceVisibility = 'hidden';
            cardElement.style.webkitFontSmoothing = 'antialiased';

            let rafId = null;

            cardElement.addEventListener('mouseenter', () => {
                if (isAnimating || cardElement.style.opacity === '0') return;
                cardElement.style.transition = 'transform 0.15s ease-out, border 0.3s ease, box-shadow 0.3s ease';
            });

            cardElement.addEventListener('mousemove', (e) => {
                if (isAnimating || cardElement.style.opacity === '0') return;

                if (rafId) window.cancelAnimationFrame(rafId);

                rafId = window.requestAnimationFrame(() => {
                    const rect = cardElement.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const xPct = (x / rect.width - 0.5) * 2;
                    const yPct = (y / rect.height - 0.5) * 2;

                    const rotateX = -yPct * MAX_TILT_ANGLE;
                    const rotateY = xPct * MAX_TILT_ANGLE;

                    let currentBaseTransform = cardElement.classList.contains('faction-card-clone')
                        ? (cardElement.dataset.baseTransform || '')
                        : 'translateY(-15px)'; 

                    cardElement.style.transition = 'transform 0.1s ease-out, border 0.3s ease, box-shadow 0.3s ease';
                    cardElement.style.transform = `${currentBaseTransform} perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
                });
            });

            cardElement.addEventListener('mouseleave', () => {
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }

                if (isAnimating || cardElement.classList.contains('locked-hover')) return;

                cardElement.style.transition = 'transform 0.4s ease-out, border 0.3s ease, box-shadow 0.3s ease';

                if (cardElement.classList.contains('faction-card-clone')) {
                    let baseTransform = cardElement.dataset.baseTransform || '';
                    cardElement.style.transform = `${baseTransform} perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
                } else {
                    cardElement.style.transform = '';
                }
            });
        }

        const allCards = document.querySelectorAll('.faction-card');
        allCards.forEach(card => applyTilt(card));

        const testersBtns = document.querySelectorAll('.btn-testers');
        const uiFaction = document.querySelector('.ui-faction');
        const factionsGrid = document.querySelector('.factions-grid'); 
        
        let focusOverlay = document.querySelector('.focus-overlay');
        if (!focusOverlay) {
            focusOverlay = document.createElement('div');
            focusOverlay.className = 'focus-overlay';
            uiFaction.appendChild(focusOverlay);
        }

        let activeOriginalCard = null;
        let activeClone = null;
        let isAnimating = false; 

        const rightSideFactions = ['ttc', 'taxi', 'grove-street', 'los-aztecas'];

        testersBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.faction-card');

                const grid = document.querySelector('.factions-grid');
                const cardRect = card.getBoundingClientRect();
                const gridRect = grid.getBoundingClientRect();

                // Verificăm vizibilitatea reală
                const isFullyVisible = (cardRect.top >= gridRect.top - 5) && (cardRect.bottom <= gridRect.bottom + 5);

                if (!isFullyVisible) {
                    // Înghețăm cardul vizual sus ca să nu cadă
                    card.classList.add('locked-hover');
                    card.style.setProperty('transform', 'translateY(-15px) translateZ(0)', 'important');
                    card.style.setProperty('transition', 'transform 0.3s ease', 'important');
                    
                    grid.style.pointerEvents = 'none';

                    // Calcul scroll manual la centru
                    const targetScrollTop = grid.scrollTop + (cardRect.top - gridRect.top) - (gridRect.height / 2) + (cardRect.height / 2);

                    grid.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        grid.style.pointerEvents = 'auto';
                        card.classList.remove('locked-hover');
                        
                        if (!card.matches(':hover')) {
                            card.style.transform = 'translateZ(0)';
                        }
                    }, 550);

                    return; 
                }

                if (card.classList.contains('capacity-animating')) {
                    showNotification("Așteaptă până când interfața este încărcată complet!");
                    return; // Oprim execuția ca să nu deschidă cardul
                }

                // Păstrăm blocajul pentru celelalte animații de UI (ca să nu faci spam de click)
                if (isAnimating || activeOriginalCard || activeClone) return;

                card.style.transition = 'none';
                card.style.transform = ''; 

                const uiRect = uiFaction.getBoundingClientRect();

                // Preluăm mărimile fizice, reale, care exclud deformarea 3D
                const exactWidth = card.offsetWidth;
                const exactHeight = card.offsetHeight;

                isAnimating = true;
                activeOriginalCard = card;

                const startX = cardRect.left - uiRect.left;
                const startY = cardRect.top - uiRect.top;

                activeClone = card.cloneNode(true);
                applyTilt(activeClone);

                activeClone.style.transition = 'none'; 
                activeClone.classList.add('faction-card-clone');
                activeClone.style.width = `${exactWidth}px`;
                activeClone.style.height = `${exactHeight}px`;
                
                activeClone.style.setProperty('left', '0px', 'important');
                activeClone.style.setProperty('top', '0px', 'important');
                activeClone.style.setProperty('margin', '0px', 'important');
                
                const initialTransform = `translate(${startX}px, ${startY}px)`;
                activeClone.style.transform = `${initialTransform} perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                activeClone.dataset.baseTransform = initialTransform;

                uiFaction.appendChild(activeClone);

                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
                focusOverlay.classList.add('active');
                factionsGrid.style.overflow = 'hidden';

                void activeClone.offsetWidth; 

                const factionKey = card.getAttribute('data-faction'); 
                const targetY = (uiRect.height / 2) - (exactHeight / 2);
                let targetCardX, targetPanelX, startPanelX;
                
                const cardExtend = document.querySelector('.card-extend');
                cardExtend.className = `card-extend ${factionKey}`; 
                cardExtend.style.height = `${exactHeight}px`;
                
                cardExtend.style.setProperty('position', 'absolute', 'important');
                cardExtend.style.setProperty('left', '0px', 'important');
                cardExtend.style.setProperty('top', '0px', 'important');
                cardExtend.style.setProperty('margin', '0px', 'important');

                const panelWidth = cardExtend.offsetWidth || (uiRect.width * 0.35);

                if (rightSideFactions.includes(factionKey)) {
                    targetCardX = (uiRect.width * 0.78) - (exactWidth / 2);
                    targetPanelX = (uiRect.width * 0.3) - (panelWidth / 2);
                    startPanelX = -panelWidth - 100;
                } else {
                    targetCardX = (uiRect.width * 0.22) - (exactWidth / 2);
                    targetPanelX = (uiRect.width * 0.7) - (panelWidth / 2);
                    startPanelX = uiRect.width + 100;
                }

                populateExtendedCard(factionKey);

                cardExtend.style.transition = 'none';
                cardExtend.style.transform = `translate(${startPanelX}px, ${targetY}px) scale(0.95)`;

                void cardExtend.offsetWidth; 

                const finalCardTransform = `translate(${targetCardX}px, ${targetY}px)`;
                activeClone.dataset.baseTransform = finalCardTransform;

                activeClone.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                activeClone.style.transform = `${finalCardTransform} perspective(1000px) rotateX(0deg) rotateY(0deg)`;

                cardExtend.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease, border 0.3s ease, box-shadow 0.3s ease';

                setTimeout(() => {
                    cardExtend.style.transform = `translate(${targetPanelX}px, ${targetY}px) scale(1)`;
                    cardExtend.classList.add('active');
                    isAnimating = false;
                }, 50); 
            });
        });

        function closeActiveCard() {
            if (isAnimating || !activeClone || !activeOriginalCard) return;
            isAnimating = true; 

            const cardExtend = document.querySelector('.card-extend');
            const factionKey = activeOriginalCard.getAttribute('data-faction');

            factionsGrid.style.pointerEvents = 'none';

            if (cardExtend) {
                const panelWidth = cardExtend.offsetWidth || 500;
                const uiRect = uiFaction.getBoundingClientRect();
                const outPanelX = rightSideFactions.includes(factionKey) ? -panelWidth - 100 : uiRect.width + 100;
                const targetY = (uiRect.height / 2) - (activeClone.offsetHeight / 2);

                cardExtend.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, border 0.3s ease, box-shadow 0.3s ease';
                cardExtend.classList.remove('active');
                cardExtend.style.transform = `translate(${outPanelX}px, ${targetY}px) scale(0.95)`;
            }

            focusOverlay.classList.remove('active');

            const restingRect = activeOriginalCard.getBoundingClientRect();
            const uiRect = uiFaction.getBoundingClientRect();
            const restX = restingRect.left - uiRect.left;
            const restY = restingRect.top - uiRect.top;

            const restingTransform = `translate(${restX}px, ${restY}px)`;
            activeClone.dataset.baseTransform = restingTransform;

            activeClone.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            activeClone.style.transform = `${restingTransform} perspective(1000px) rotateX(0deg) rotateY(0deg)`;

            setTimeout(() => {
                if (activeClone) {
                    activeClone.remove();
                    activeClone = null;
                }
                if (activeOriginalCard) {
                    activeOriginalCard.style.transform = 'translateZ(0)';
                    activeOriginalCard.style.opacity = '1';
                    activeOriginalCard.style.pointerEvents = 'auto';
                    activeOriginalCard = null;
                }
                
                factionsGrid.style.pointerEvents = 'auto';
                factionsGrid.style.overflow = '';
                isAnimating = false;
            }, 400); 
        }

        if (focusOverlay) focusOverlay.addEventListener('click', closeActiveCard);
        const closeBtn = document.querySelector('.close-ui-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeActiveCard);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeActiveCard();
        });
    });

    function populateExtendedCard(factionKey) {
        const data = factionMembers[factionKey];
        if (!data) return;

        const extendCard = document.querySelector('.card-extend');
        const headerTitle = extendCard.querySelector('.card-extend-header h1');
        const managerInfo = extendCard.querySelector('.manager-info');
        const tableBody = extendCard.querySelector('.table-body');

        tableBody.scrollTop = 0;

        headerTitle.textContent = factionNames[factionKey] || factionKey.toUpperCase();

        if (data.manager && data.manager.name !== "No One") {
            const isOnline = data.manager.online;
            const statusClass = isOnline ? 'online-badge' : 'offline-badge';
            const statusIcon = isOnline ? 'fa-circle-check' : 'fa-circle-xmark';
            const statusText = isOnline ? 'Online' : 'Offline';

            managerInfo.innerHTML = `
                <span class="manager-name">${data.manager.name}</span>
                <span class="manager-badge"><i class="fa-solid fa-user-tie"></i> Manager</span>
                <span class="${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${statusText}</span>
            `;
            managerInfo.style.display = 'flex';
        } else {
            managerInfo.style.display = 'none';
        }

        tableBody.innerHTML = '';
        
        if (data.staff) {
            data.staff.forEach(member => {
                const rankData = rankConfig[member.rank];
                const statusClass = member.online ? 'online-badge' : 'offline-badge';
                const statusIcon = member.online ? 'fa-circle-check' : 'fa-circle-xmark';
                const statusText = member.online ? 'Online' : 'Offline';

                const row = document.createElement('div');
                row.className = 'member-row';

                row.innerHTML = `
                    <div class="table-cell"><div class="circle" style="margin-left: 0;"></div></div>
                    <div class="table-cell"><span class="member-name">${member.name}</span></div>
                    <div class="table-cell"><span class="${rankData.badgeClass}"><i class="fa-solid ${rankData.icon}"></i> ${rankData.label}</span></div>
                    <div class="table-cell"><span class="${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${statusText}</span></div>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    function updateLeaderNames() {
        document.querySelectorAll('.faction-card[data-faction]').forEach(card => {
            const factionKey = card.getAttribute('data-faction');
            const data = factionMembers[factionKey];
            if (data && data.staff) {
                const leader = data.staff.find(m => m.rank === "leader");
                const display = card.querySelector('.leader-name-display');
                if (leader && display && leader.name !== "No One") display.textContent = leader.name;
            }
        });
    }

    function updateApplicationStatus() {
        document.querySelectorAll('.faction-card[data-faction]').forEach(card => {
            const factionKey = card.getAttribute('data-faction');
            const data = factionMembers[factionKey];
            const statusElement = card.querySelector('.app-status'); 
            if (data && statusElement) {
                statusElement.textContent = `App Status: ${data.applicationsOpen ? 'Open' : 'Closed'}`;
                statusElement.className = `app-status ${data.applicationsOpen ? 'open' : 'closed'}`;
            }
        });
    }

    function animateCapacityAndMembers() {
        const gridContainer = document.querySelector('.factions-grid');
        const cards = document.querySelectorAll('.faction-card');

        cards.forEach(card => {
            const membersCountSpan = card.querySelectorAll('.members-count span')[1];
            const barFill = card.querySelector('.bar-fill');
            
            const parts = membersCountSpan.textContent.split('/');
            card.dataset.targetCurrent = parseInt(parts[0]);
            card.dataset.maxMembers = parseInt(parts[1]);

            // Stare inițială: cifrele la 0, bara la 0%
            membersCountSpan.textContent = `0 / ${card.dataset.maxMembers}`;
            barFill.style.width = '0%';
            
            // Marcăm cardul ca fiind "în animație" încă de la început
            card.classList.add('capacity-animating');
        });

        const observer = new IntersectionObserver((entries) => {
            const intersecting = entries.filter(e => e.isIntersecting);
            
            intersecting.forEach((entry, index) => {
                const card = entry.target.closest('.faction-card');
                if (card && !card.classList.contains('card-visible')) {
                    observer.unobserve(entry.target);

                    // Delay pentru intrarea cardului (picat de sus)
                    setTimeout(() => {
                        card.classList.add('card-visible');
                        // Pornim numărătoarea și bara simultan
                        runSyncAnimation(card);
                    }, index * 190); 
                }
            });
        }, { root: gridContainer, threshold: 0.1 });

        cards.forEach(card => {
            const capBar = card.querySelector('.capacity-bar');
            if (capBar) observer.observe(capBar);
        });

        function runSyncAnimation(card) {
            const membersCountSpan = card.querySelectorAll('.members-count span')[1];
            const barFill = card.querySelector('.bar-fill');
            
            const targetCurrent = parseInt(card.dataset.targetCurrent);
            const maxMembers = parseInt(card.dataset.maxMembers);
            const targetPercent = (targetCurrent / maxMembers) * 100;

            const duration = 1500; 
            const startTime = performance.now();

            function frame(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing: face animația să încetinească spre final (smooth)
                const ease = 1 - Math.pow(1 - progress, 3);

                // ACTUALIZARE SIMULTANĂ
                // 1. Cifrele
                const currentNum = Math.floor(targetCurrent * ease);
                membersCountSpan.textContent = `${currentNum} / ${maxMembers}`;

                // 2. Bara (calculăm procentul exact din progres)
                const currentWidth = (targetPercent * ease).toFixed(2);
                barFill.style.width = currentWidth + '%';

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    // Final fix
                    membersCountSpan.textContent = `${targetCurrent} / ${maxMembers}`;
                    barFill.style.width = targetPercent + '%';
                    
                    // ABIA ACUM scoatem clasa, permițând click-ul
                    card.classList.remove('capacity-animating');
                }
            }
            requestAnimationFrame(frame);
        }
    }

    // --- FUNCȚIE GLOBALĂ PENTRU NOTIFICĂRI ---
    function showNotification(message, duration = 3000) { // Default 4 secunde
        let container = document.getElementById('notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.querySelector('.ui-faction').appendChild(container);
        }

        // Creăm structura completă a notificării
        const notif = document.createElement('div');
        notif.className = 'custom-notification';
        notif.innerHTML = `
            <div class="notif-header">
                <div class="notif-title-area">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>Attention</span>
                </div>
                <i class="fa-solid fa-xmark notif-close"></i>
            </div>
            <div class="notif-body">
                ${message}
            </div>
            <div class="notif-progress-container">
                <div class="notif-progress-bar"></div>
            </div>
        `;

        container.appendChild(notif);

        const closeBtn = notif.querySelector('.notif-close');
        const progressBar = notif.querySelector('.notif-progress-bar');
        
        let hideTimeout;

        const triggerClose = () => {
            notif.classList.remove('show');
            clearTimeout(hideTimeout); // Oprim timer-ul dacă dăm click pe X
            
            setTimeout(() => {
                if (notif.parentNode) notif.remove();
            }, 400); // Așteptăm să se termine efectul de slide out
        };

        // Eveniment pe click pe X
        closeBtn.addEventListener('click', triggerClose);

        // Animăm intrarea
        setTimeout(() => {
            notif.classList.add('show');
            
            // După ce a intrat pe ecran, pornim golirea barei fix pe durata timer-ului
            progressBar.style.transition = `width ${duration}ms linear`;
            progressBar.style.width = '0%';
        }, 10); 

        // Timer-ul de auto-închidere
        hideTimeout = setTimeout(() => {
            triggerClose();
        }, duration);
    }
