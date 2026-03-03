        const barObserverOptions = { threshold: 0.5 };
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    const bar = container.querySelector('.bar-fill');
                    const card = container.closest('.faction-card');
                    const countSpan = card.querySelector('.members-count span:last-child');
                    if (countSpan && bar) {
                        const countText = countSpan.innerText.trim();
                        const parts = countText.split('/');
                        if (parts.length === 2) {
                            const procent = (parseInt(parts[0]) / parseInt(parts[1])) * 100;
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    bar.style.setProperty('width', procent + '%', 'important');
                                });
                            });
                            barObserver.unobserve(container);
                        }
                    }
                }
            });
        }, barObserverOptions);

        function getMoveX(card) {
            const isSmall = window.innerWidth < 700;
            
            if (card.classList.contains('lspd')) return 50;
            if (card.classList.contains('hitman')) return -260;
            if (card.classList.contains('tow-truck')) return 260;
            if (card.classList.contains('taxi')) return -50;
            if (card.classList.contains('swat')) return 50;
            if (card.classList.contains('ballas')) return -260;
            if (card.classList.contains('los-vagos')) return 260;
            if (card.classList.contains('grove-street')) return -50;
            if (card.classList.contains('los-aztecas')) {
                return isSmall ? -30 : -410; // Aici se face magia pentru ecran mic
            }
            return -100; // Valoarea default
        }

        document.querySelectorAll('.capacity-bar').forEach(barContainer => {
            barObserver.observe(barContainer);
        });

        const isSmallScreen = window.innerWidth < 700;

        document.querySelectorAll('.faction-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const intensity = card.classList.contains('active-card') ? 60 : 30;
                const rotateX = (y - centerY) / -intensity;
                const rotateY = (centerX - x) / -intensity;
                let moveX = getMoveX(card);

                if (card.classList.contains('active-card')) {
                    const savedMoveY = card._centerMoveY || 0;
                    card.style.transform = `perspective(1000px) scale(1.12) translateX(${moveX}px) translateY(${savedMoveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }

                if (card.classList.contains('active-card')) {
                    const savedMoveY = card._centerMoveY || 0;
                    card.style.transform = `perspective(1000px) scale(1.12) translateX(${moveX}px) translateY(${savedMoveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.25s ease-out, border-color 0.3s ease-out';
                let moveX = getMoveX(card);

                if (card.classList.contains('active-card')) {
                    const savedMoveY = card._centerMoveY || 0;
                    card.style.transform = `perspective(1000px) scale(1.12) translateX(${moveX}px) translateY(${savedMoveY}px) rotateX(0) rotateY(0)`;
                } else {
                    card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
                }

                if (card.classList.contains('active-card')) {
                    const savedMoveY = card._centerMoveY || 0;
                    card.style.transform = `perspective(1000px) scale(1.12) translateX(${moveX}px) translateY(${savedMoveY}px) rotateX(0) rotateY(0)`;
                } else {
                    card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
                }
            });
        });

        const btntesters = document.querySelectorAll('.btn-testers');
        const factionsGrid = document.querySelector('.factions-grid');
        const factionsOverlay = document.querySelector('.factions-overlay');
        const cardExtend = document.querySelector('.card-extend');

        btntesters.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.stopPropagation();
                const card = this.closest('.faction-card');
                const factionName = card.getAttribute('data-faction');
                
                const specificExtend = document.querySelector(`.card-extend[data-for="${factionName}"]`);

                const gridRect = factionsGrid.getBoundingClientRect();
                const cardRect = card.getBoundingClientRect();

                const isPartiallyHiddenTop = cardRect.top < gridRect.top - 2;
                const isPartiallyHiddenBottom = cardRect.bottom > gridRect.bottom + 2;
                
                if (isPartiallyHiddenTop || isPartiallyHiddenBottom) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }

                let moveX = getMoveX(card);

                const freshRect = card.getBoundingClientRect();
                const transformStr = card.style.transform || '';
                const tyMatch = transformStr.match(/translateY\(([\d.-]+)px\)/);
                const currentTY = tyMatch ? parseFloat(tyMatch[1]) : 0;
                const cardCenterY = freshRect.top + freshRect.height / 2 - currentTY;
                const viewportCenterY = window.innerHeight / 2;
                let moveY = viewportCenterY - cardCenterY;
                if (card.classList.contains('los-aztecas')) { moveY += 20; }

                document.querySelectorAll('.faction-card').forEach(c => {
                    c.classList.remove('active-card');
                    c._centerMoveY = 0;
                });
                document.querySelectorAll('.card-extend').forEach(e => e.classList.remove('show'));

                card.classList.add('active-card');
                card._centerMoveY = moveY;

                card.style.transition = 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
                card.style.transform = `perspective(1000px) scale(1.12) translateX(${moveX}px) translateY(${moveY}px)`;

                renderStaffForFaction(factionName);

                if (specificExtend) {
                    specificExtend.classList.add('show');
                    const isLeftSide = ['tow-truck', 'taxi', 'los-vagos', 'grove-street'].includes(factionName);
                    const xDist = isLeftSide ? '-115%' : '15%';
                }
                
                if (factionsOverlay) factionsOverlay.classList.add('active');
                if (factionsGrid) {
                    factionsGrid.classList.add('has-active-card');
                    factionsGrid.style.overflow = 'hidden'; 
                }
            });
        });

        window.addEventListener('click', function(event) {
        const activeCard = document.querySelector('.faction-card.active-card');
        const activeExtend = document.querySelector('.card-extend.show');

        if (!activeCard) return;

        if (activeExtend) {
            if (activeExtend.contains(event.target) || activeCard.contains(event.target)) return;
            activeExtend.classList.remove('show');
            activeExtend.style.transform = '';
        } else {
            if (activeCard.contains(event.target)) return;
        }

        activeCard.style.transition = 'transform 0.3s ease-out';
        activeCard.classList.remove('active-card');
        activeCard._centerMoveY = 0;
        activeCard.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
        
        if (factionsOverlay) factionsOverlay.classList.remove('active');
        if (factionsGrid) {
            factionsGrid.classList.remove('has-active-card');
            factionsGrid.style.overflow = 'auto';
        }
    });

    function addMemberCircles(root = document) {
        const nameSelectors = ['.leader-name', '.co-leader-name', '.tester-name'];
        
        nameSelectors.forEach(selector => {
            root.querySelectorAll(selector).forEach(nameEl => {
                if (!nameEl.previousElementSibling || !nameEl.previousElementSibling.classList.contains('member-circle')) {
                    const circleWrapper = document.createElement('div');
                    circleWrapper.classList.add('member-circle');

                    const circle = document.createElement('span');
                    circle.classList.add('circle');
                    
                    circleWrapper.appendChild(circle);
                    
                    nameEl.parentNode.insertBefore(circleWrapper, nameEl);
                }
            });
        });
    }

    addMemberCircles();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { 
                    addMemberCircles(node);
                }
            });
        });
    });

    observer.observe(document.querySelector('.faction-staff'), {
        childList: true,
        subtree: true
    });

    const rankConfig = {

        "manager": { 
            badgeClass: "manager-badge", 
            nameClass: "manager-name", 
            icon: "fa-user-tie", 
            label: "Manager" 
        },
        "leader": {
            badgeClass: "leader-badge",
            nameClass: "leader-name",
            icon: "fa-crown",
            label: "Leader"
        },

        "co-leader": { 
            badgeClass: "co-leader-badge", 
            nameClass: "co-leader-name", 
            icon: "fa-shield", 
            label: "Co-Leader" 
        },

        "tester": { 
            badgeClass: "tester-badge", 
            nameClass: "tester-name", 
            icon: "fa-magnifying-glass", 
            label: "Tester" 
        }
    }

    const factionMembers = {
    "lspd": {
        manager: {
            name: "Kaos",
            online: true
        },
        staff: [
            { name: "KeTeX", rank: "leader", online: true },
            { name: "rowly", rank: "co-leader", online: false },
            { name: "SilyMike", rank: "tester", online: true }
        ]
    },
    "hitman": {
        manager: {
            name: "RobertxD",
            online: false
        },
        staff: [
            { name: "Davidd", rank: "leader", online: true },
            { name: "Lamba", rank: "co-leader", online: false },
            { name: "Cartof", rank: "tester", online: false }    
        ]
    },
    "tow-truck": {
        manager: {
            name: "hasalf",
            online: true
        },
        staff: [
            { name: "Bunicul", rank: "leader", online: false },
            { name: "Tele", rank: "co-leader", online: true },
            { name: "laarissaa", rank: "tester", online: false }
        ]
    },
    "taxi": {
        manager: {
            name: "AlexMatew",
            online: false
        },
        staff: [
            { name: "C_Jay", rank: "leader", online: false },
            { name: "raGGaBAws", rank: "co-leader", online: true },
            { name: "PiqueS", rank: "tester", online: true }
        ]
    },
    "swat": {
        manager: {
            name: "No One",
            online: false
        },
        staff: [
           { name: "No One", rank: "leader", online: false },
           { name: "Test2", rank: "co-leader", online: false },
           { name: "Test3", rank: "tester", online: true}
        ]
    },
    "ballas": {
        manager: {
            name: "Archer",
            online: true
        },
        staff: [
            { name: "lava", rank: "leader", online: false },
            { name: "LuisVasile24", rank: "co-leader", online: true },
            { name: "Cartof", rank: "tester", online:  true}
        ]
    },
    "los-vagos": {
        manager: {
            name: "Andi",
            online: true
        },
        staff: [
            { name: "Geo7", rank: "leader", online: false },
            { name: "Citiregu", rank: "co-leader", online: false },
            { name: "K3zR", rank: "tester", online: true }
        ]
    },
    "grove-street": {
        manager: {
            name: "Archer",
            online: true
        },
        staff: [
            { name: "Dulciku", rank: "leader", online: false },
            { name: "PRiNCE", rank: "co-leader", online: true },
            { name: "nusuntallex", rank: "tester", online:  false}
        ]
    },
    "los-aztecas": {
        manager: {
            name: "Andi",
            online: true
        },
        staff: [
            { name: "Marquez", rank: "leader", online: true },
            { name: "bkm", rank: "co-leader", online: false },
            { name: "palboy", rank: "tester", online:  false}
        ]
    }
};

function renderStaffForFaction(factionKey) {
    console.log("Rendering faction:", factionKey);
    const data = factionMembers[factionKey];
    const card = document.querySelector(`.card-extend[data-for="${factionKey}"]`);
    
    if (!card) {
        console.error("Extended card missing for:", factionKey);
        return;
    }
    if (!data) {
        console.error("No information about factionsMembers for:", factionKey);
        return;
    }

    const managerContainer = card.querySelector('.manager');
    if (managerContainer) {
        const m = data.manager;
        const statusClass = m.online ? "online-badge" : "offline-badge";
        const statusIcon = m.online ? "fa-circle-check" : "fa-circle-xmark";

        managerContainer.innerHTML = `
            <span class="manager-name">${m.name}</span>
            <span class="manager-badge"><i class="fas fa-user-tie"></i> Manager</span>
            <span class="${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${m.online ? 'Online' : 'Offline'}</span>
        `;
    }

    const tableBody = card.querySelector('.table-body');
    if (tableBody) {
        console.log("Members generated!");
        tableBody.innerHTML = ""; 
        
        data.staff.forEach(member => {
            const config = rankConfig[member.rank];
            const sClass = member.online ? "online-badge" : "offline-badge";
            const sIcon = member.online ? "fa-circle-check" : "fa-circle-xmark";

            const row = document.createElement("div");
            row.className = "member-row";
            row.innerHTML = `
                <div class="table-cell"><span class="${config.nameClass}">${member.name}</span></div>
                <div class="table-cell">
                    <span class="${config.badgeClass}"><i class="fa-solid ${config.icon}"></i> ${config.label}</span>
                </div>
                <div class="table-cell">
                    <span class="${sClass}"><i class="fa-solid ${sIcon}"></i> ${member.online ? 'Online' : 'Offline'}</span>
                </div>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error("Error, player has not found.");
    }

    if (typeof addMemberCircles === "function") addMemberCircles(card);
}

function updateLeaderNames() {
    const cards = document.querySelectorAll('.faction-card[data-faction]');

    cards.forEach(card => {
        const factionKey = card.getAttribute('data-faction');
        const data = factionMembers[factionKey];

        if (data && data.staff) {
            const leader = data.staff.find(m => m.rank === "leader");
            
            if (leader) {
                const leaderDisplay = card.querySelector('.leader-name-display');
                if (leaderDisplay) {
                    leaderDisplay.textContent = leader.name;
                } else {
                    const leaderParagraph = card.querySelector('.info-section p');
                    if (leaderParagraph) {
                        leaderParagraph.textContent = `Leader: ${leader.name}`;
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', updateLeaderNames);