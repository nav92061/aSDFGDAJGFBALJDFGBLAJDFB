// Simple worker to serve the static game
export default {
  async fetch(request, env, ctx) {
    // Get the path from the request
    const url = new URL(request.url);
    const path = url.pathname;
    
    // If it's the root path, serve the index.html
    if (path === '/' || path === '/index.html') {
      return new Response(getGameHTML(), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // Return 404 for other paths
    return new Response('Not Found', { status: 404 });
  }
};

function getGameHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Sports Tycoon: Prospect Hunter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #232526 0%, #414345 100%);
            color: #222;
            min-height: 100vh;
            transition: background 0.5s;
        }
        .game-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 24px;
        }
        .header {
            background: rgba(255, 255, 255, 0.98);
            padding: 28px 24px 20px 24px;
            border-radius: 18px;
            margin-bottom: 28px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header h1 {
            font-size: 2.2em;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 12px;
            color: #4f8cff;
            text-shadow: 0 2px 8px rgba(79,140,255,0.08);
        }
        .stats-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-bottom: 0;
            justify-content: center;
        }
        .stat-item {
            background: linear-gradient(45deg, #4f8cff, #a770ef);
            color: #fff;
            padding: 16px 22px;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
            font-size: 1.1em;
            box-shadow: 0 4px 16px rgba(79,140,255,0.13);
            min-width: 140px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-item:hover {
            transform: translateY(-2px) scale(1.04);
            box-shadow: 0 8px 32px rgba(79,140,255,0.18);
        }
        .game-tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .tab-btn {
            background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
            color: #222;
            border: none;
            padding: 13px 28px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 700;
            font-size: 1.05em;
            transition: all 0.25s;
            box-shadow: 0 4px 16px rgba(67,233,123,0.13);
        }
        .tab-btn:hover {
            transform: translateY(-2px) scale(1.04);
            box-shadow: 0 8px 32px rgba(67,233,123,0.18);
        }
        .tab-btn.active {
            background: linear-gradient(45deg, #f7971e 0%, #ffd200 100%);
            color: #222;
        }
        .tab-content {
            display: none;
            background: rgba(255, 255, 255, 0.98);
            padding: 32px 24px;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.13);
            margin-bottom: 24px;
            animation: fadeIn 0.5s;
        }
        .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .world-map {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 24px;
            margin-top: 24px;
        }
        .country-card {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: #222;
            padding: 24px 18px;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.25s;
            box-shadow: 0 4px 16px rgba(67,233,123,0.13);
        }
        .country-card:hover {
            transform: translateY(-6px) scale(1.03);
            box-shadow: 0 12px 36px rgba(67,233,123,0.22);
        }
        .country-card h3 {
            margin-bottom: 10px;
            font-size: 1.25em;
        }
        .prospects-list {
            max-height: 420px;
            overflow-y: auto;
            margin-top: 24px;
        }
        .prospect-card {
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            padding: 18px 16px;
            margin-bottom: 14px;
            border-radius: 12px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .prospect-card:hover {
            border-color: #43e97b;
            box-shadow: 0 6px 18px rgba(67,233,123,0.13);
        }
        .recruit-btn {
            background: linear-gradient(45deg, #f7971e 0%, #ffd200 100%);
            color: #222;
            border: none;
            padding: 9px 18px;
            border-radius: 22px;
            cursor: pointer;
            font-weight: 700;
            float: right;
            transition: background 0.2s;
        }
        .recruit-btn:hover {
            background: linear-gradient(45deg, #ffd200 0%, #f7971e 100%);
        }
        .athlete-roster {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 18px;
            margin-top: 24px;
        }
        .athlete-card {
            background: linear-gradient(135deg, #a770ef 0%, #f6d365 100%);
            padding: 18px 14px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(167,112,239,0.13);
            color: #222;
        }
        .skill-bar {
            background: rgba(255,255,255,0.4);
            height: 10px;
            border-radius: 5px;
            margin: 6px 0 2px 0;
            overflow: hidden;
        }
        .skill-fill {
            background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
            height: 100%;
            border-radius: 5px;
            transition: width 0.5s;
        }
        .nutrition-panel {
            background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
            padding: 24px 18px;
            border-radius: 16px;
            margin-bottom: 24px;
        }
        .nutrition-items {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 18px;
            margin-top: 18px;
        }
        .nutrition-item {
            background: rgba(255,255,255,0.92);
            padding: 18px 12px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .nutrition-item:hover {
            background: #fff;
            transform: scale(1.06);
        }
        .upgrade-btn {
            background: linear-gradient(45deg, #4f8cff 0%, #a770ef 100%);
            color: #fff;
            border: none;
            padding: 12px 26px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 700;
            margin-top: 18px;
            font-size: 1.05em;
            transition: background 0.2s;
        }
        .upgrade-btn:hover {
            background: linear-gradient(45deg, #a770ef 0%, #4f8cff 100%);
        }
        .facilities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
            margin-top: 24px;
        }
        .facility-card {
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
            padding: 24px 18px;
            border-radius: 16px;
            box-shadow: 0 4px 16px rgba(246,211,101,0.13);
        }
        .tournaments-list {
            margin-top: 24px;
        }
        .tournament-card {
            background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
            padding: 24px 18px;
            border-radius: 16px;
            margin-bottom: 18px;
            box-shadow: 0 4px 16px rgba(247,151,30,0.13);
        }
        .compete-btn {
            background: linear-gradient(45deg, #4f8cff 0%, #a770ef 100%);
            color: #fff;
            border: none;
            padding: 13px 28px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 700;
            float: right;
            transition: background 0.2s;
        }
        .compete-btn:hover {
            background: linear-gradient(45deg, #a770ef 0%, #4f8cff 100%);
        }
        .log-panel {
            background: #232526;
            color: #fff;
            padding: 18px 14px;
            border-radius: 12px;
            height: 220px;
            overflow-y: auto;
            font-family: 'Fira Mono', monospace;
            font-size: 13px;
            margin-top: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background: #fff;
            margin: 10% auto;
            padding: 36px 24px;
            border-radius: 18px;
            width: 92%;
            max-width: 520px;
            box-shadow: 0 16px 48px rgba(0,0,0,0.22);
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: #222;
        }
        @media (max-width: 900px) {
            .game-container {
                padding: 10px;
            }
            .stats-bar {
                flex-direction: column;
                gap: 10px;
            }
            .facilities-grid {
                grid-template-columns: 1fr;
            }
        }
        @media (max-width: 600px) {
            .header h1 {
                font-size: 1.2em;
            }
            .tab-btn {
                padding: 10px 12px;
                font-size: 0.95em;
            }
            .tab-content {
                padding: 16px 6px;
            }
            .facility-card, .tournament-card, .nutrition-panel {
                padding: 12px 6px;
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="header">
            <h1>🏆 Global Sports Tycoon: Prospect Hunter</h1>
            <div class="stats-bar">
                <div class="stat-item">💰 Money: $<span id="money">50000</span></div>
                <div class="stat-item">⭐ Reputation: <span id="reputation">10</span></div>
                <div class="stat-item">👥 Athletes: <span id="athleteCount">0</span></div>
                <div class="stat-item">🍉 Watermelons: <span id="watermelons">20</span></div>
                <div class="stat-item">⚡ Powders: <span id="powders">5</span></div>
            </div>
        </div>

        <div class="game-tabs">
            <button class="tab-btn active" onclick="showTab('scouting')">🌍 World Scouting</button>
            <button class="tab-btn" onclick="showTab('roster')">👥 My Athletes</button>
            <button class="tab-btn" onclick="showTab('nutrition')">🍉 Nutrition</button>
            <button class="tab-btn" onclick="showTab('facilities')">🏢 Facilities</button>
            <button class="tab-btn" onclick="showTab('tournaments')">🏅 Tournaments</button>
        </div>

        <!-- Scouting Tab -->
        <div id="scouting" class="tab-content active">
            <h2>🚢 Scout the World for Talent</h2>
            <p>Send your scout ship to different countries to find promising young athletes!</p>
            
            <div class="world-map">
                <div class="country-card" onclick="scoutCountry('dominican')">
                    <h3>🇩🇴 Dominican Republic</h3>
                    <p>⚾ Baseball Prospects</p>
                    <p>Cost: $5,000 per trip</p>
                    <p>Specialty: Power hitters</p>
                </div>
                
                <div class="country-card" onclick="scoutCountry('brazil')">
                    <h3>🇧🇷 Brazil</h3>
                    <p>⚽ Soccer Prospects</p>
                    <p>Cost: $7,000 per trip</p>
                    <p>Specialty: Technical skills</p>
                </div>
                
                <div class="country-card" onclick="scoutCountry('china')">
                    <h3>🇨🇳 China</h3>
                    <p>🏓 Ping Pong Prospects</p>
                    <p>Cost: $4,000 per trip</p>
                    <p>Specialty: Lightning reflexes</p>
                </div>
                
                <div class="country-card" onclick="scoutCountry('india')">
                    <h3>🇮🇳 India</h3>
                    <p>🏏 Cricket Prospects</p>
                    <p>Cost: $6,000 per trip</p>
                    <p>Specialty: Strategic thinking</p>
                </div>
                
                <div class="country-card" onclick="scoutCountry('southsudan')">
                    <h3>🇸🇸 South Sudan</h3>
                    <p>🌟 Orphan Athletes (Any Sport)</p>
                    <p>Cost: $3,000 per trip</p>
                    <p>High Risk/High Reward!</p>
                </div>
            </div>

            <div id="prospectsList" class="prospects-list"></div>
        </div>

        <!-- Roster Tab -->
        <div id="roster" class="tab-content">
            <h2>👥 Your Athletes</h2>
            <p>Manage and train your recruited athletes</p>
            
            <div class="athlete-roster" id="athleteRoster">
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                    No athletes recruited yet. Visit the World Scouting tab to find talent!
                </div>
            </div>
        </div>

        <!-- Nutrition Tab -->
        <div id="nutrition" class="tab-content">
            <h2>🍉 Nutrition Management</h2>
            
            <div class="nutrition-panel">
                <h3>Feed Your Athletes</h3>
                <p>Combine watermelons with special powders to boost performance!</p>
                
                <div class="nutrition-items">
                    <div class="nutrition-item" onclick="feedAthletes('watermelon')">
                        <h4>🍉 Watermelon</h4>
                        <p>Basic nutrition</p>
                        <p>Cost: Free (you have <span id="watermelonCount">20</span>)</p>
                    </div>
                    
                    <div class="nutrition-item" onclick="feedAthletes('protein')">
                        <h4>💪 Protein Powder</h4>
                        <p>+Strength boost</p>
                        <p>Cost: 1 powder + $100</p>
                    </div>
                    
                    <div class="nutrition-item" onclick="feedAthletes('focus')">
                        <h4>🧠 Focus Powder</h4>
                        <p>+Intelligence boost</p>
                        <p>Cost: 1 powder + $100</p>
                    </div>
                    
                    <div class="nutrition-item" onclick="feedAthletes('speed')">
                        <h4>⚡ Speed Powder</h4>
                        <p>+Speed boost</p>
                        <p>Cost: 1 powder + $100</p>
                    </div>
                </div>
                
                <button class="upgrade-btn" onclick="buySupplies()">🛒 Buy More Supplies</button>
            </div>
        </div>

        <!-- Facilities Tab -->
        <div id="facilities" class="tab-content">
            <h2>🏢 Training Facilities</h2>
            
            <div class="facilities-grid" id="facilitiesGrid">
                <div class="facility-card">
                    <h3>🏟️ Arizona Academy</h3>
                    <p>Level: <span id="arizonaLevel">1</span></p>
                    <p>Sports: Baseball, Cricket, Ping Pong</p>
                    <p>Capacity: <span id="arizonaCapacity">10</span> athletes</p>
                    <button class="upgrade-btn" onclick="upgradeFacility('arizona')">
                        Upgrade ($<span id="arizonaCost">20000</span>)
                    </button>
                </div>
                
                <div class="facility-card">
                    <h3>⚽ Europe Training Center</h3>
                    <p>Level: <span id="europeLevel">1</span></p>
                    <p>Sports: Soccer</p>
                    <p>Capacity: <span id="europeCapacity">8</span> athletes</p>
                    <button class="upgrade-btn" onclick="upgradeFacility('europe')">
                        Upgrade ($<span id="europeCost">25000</span>)
                    </button>
                </div>
            </div>
        </div>

        <!-- Tournaments Tab -->
        <div id="tournaments" class="tab-content">
            <h2>🏅 Tournaments & Competitions</h2>
            
            <div class="tournaments-list" id="tournamentsList">
                <div class="tournament-card">
                    <h3>🥉 Local Youth League</h3>
                    <p>Entry Fee: $1,000 | Prize: $5,000 | Reputation: +5</p>
                    <p>Requirement: Any sport, skill level 30+</p>
                    <button class="compete-btn" onclick="enterTournament('local')">Enter Tournament</button>
                </div>
                
                <div class="tournament-card">
                    <h3>🥈 Regional Championship</h3>
                    <p>Entry Fee: $5,000 | Prize: $20,000 | Reputation: +15</p>
                    <p>Requirement: Any sport, skill level 60+</p>
                    <button class="compete-btn" onclick="enterTournament('regional')">Enter Tournament</button>
                </div>
                
                <div class="tournament-card">
                    <h3>🥇 International Masters</h3>
                    <p>Entry Fee: $15,000 | Prize: $100,000 | Reputation: +50</p>
                    <p>Requirement: Any sport, skill level 90+</p>
                    <button class="compete-btn" onclick="enterTournament('international')">Enter Tournament</button>
                </div>
            </div>
        </div>

        <!-- Game Log -->
        <div class="log-panel" id="gameLog">
            <div>🎮 Welcome to Global Sports Tycoon: Prospect Hunter!</div>
            <div>💡 Start by scouting different countries for talent...</div>
        </div>
    </div>

    <!-- Modals -->
    <div id="scoutModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="scoutModalTitle">Scouting Results</h2>
            <div id="scoutModalContent"></div>
        </div>
    </div>

    <script>
        // Game State
        let gameState = {
            money: 50000,
            reputation: 10,
            watermelons: 20,
            powders: 5,
            athletes: [],
            facilities: {
                arizona: { level: 1, capacity: 10 },
                europe: { level: 1, capacity: 8 }
            },
            day: 1
        };

        // Prospect templates
        const prospectTemplates = {
            dominican: {
                sport: 'Baseball',
                names: ['Carlos', 'Miguel', 'José', 'Rafael', 'Diego'],
                specialties: ['Power Hitting', 'Pitching', 'Fielding', 'Base Running'],
                flag: '🇩🇴'
            },
            brazil: {
                sport: 'Soccer',
                names: ['Ronaldo', 'Pelé', 'Cafu', 'Zico', 'Kaká'],
                specialties: ['Dribbling', 'Shooting', 'Passing', 'Defending'],
                flag: '🇧🇷'
            },
            china: {
                sport: 'Ping Pong',
                names: ['Wei', 'Li', 'Zhang', 'Wang', 'Chen'],
                specialties: ['Forehand', 'Backhand', 'Serve', 'Defense'],
                flag: '🇨🇳'
            },
            india: {
                sport: 'Cricket',
                names: ['Raj', 'Arjun', 'Vikram', 'Rohit', 'Virat'],
                specialties: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping'],
                flag: '🇮🇳'
            },
            southsudan: {
                sport: 'Multi-Sport',
                names: ['Akech', 'Deng', 'Garang', 'Nyong', 'Bol'],
                specialties: ['Raw Talent', 'Determination', 'Athleticism', 'Heart'],
                flag: '🇸🇸'
            }
        };

        // Tab management
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // Initialize game
        function initGame() {
            updateUI();
            logMessage('🎮 Game initialized! Start scouting for talent!');
        }

        // Scouting system
        function scoutCountry(country) {
            const costs = {
                dominican: 5000,
                brazil: 7000,
                china: 4000,
                india: 6000,
                southsudan: 3000
            };

            if (gameState.money < costs[country]) {
                logMessage("❌ Not enough money to scout " + country + "! Need $" + costs[country] + "");
                return;
            }

            gameState.money -= costs[country];
            
            // Generate prospects
            const prospects = generateProspects(country);
            showScoutingResults(country, prospects);
            
            logMessage("🚢 Scouting " + country + "... Found " + prospects.length + " prospects!");
            updateUI();
        }

        function generateProspects(country) {
            const template = prospectTemplates[country];
            const numProspects = Math.floor(Math.random() * 4) + 2; // 2-5 prospects
            const prospects = [];

            for (let i = 0; i < numProspects; i++) {
                const prospect = {
                    id: Date.now() + i,
                    name: template.names[Math.floor(Math.random() * template.names.length)],
                    country: country,
                    sport: template.sport,
                    specialty: template.specialties[Math.floor(Math.random() * template.specialties.length)],
                    age: Math.floor(Math.random() * 6) + 14, // 14-19 years old
                    skills: {
                        strength: Math.floor(Math.random() * 40) + 20,
                        speed: Math.floor(Math.random() * 40) + 20,
                        intelligence: Math.floor(Math.random() * 40) + 20,
                        technique: Math.floor(Math.random() * 40) + 20
                    },
                    potential: Math.floor(Math.random() * 30) + 70, // 70-99 potential
                    cost: Math.floor(Math.random() * 8000) + 2000, // $2000-10000
                    happiness: 100,
                    health: 100,
                    flag: template.flag
                };

                // South Sudan orphans have high potential but lower initial skills
                if (country === 'southsudan') {
                    prospect.potential = Math.floor(Math.random() * 20) + 80; // 80-99 potential
                    Object.keys(prospect.skills).forEach(skill => {
                        prospect.skills[skill] = Math.floor(Math.random() * 30) + 10; // Lower starting skills
                    });
                    prospect.cost = Math.floor(Math.random() * 3000) + 1000; // Cheaper
                    prospect.backstory = "Orphan with incredible potential";
                }

                prospects.push(prospect);
            }

            return prospects;
        }

        function showScoutingResults(country, prospects) {
            const modal = document.getElementById('scoutModal');
            const title = document.getElementById('scoutModalTitle');
            const content = document.getElementById('scoutModalContent');
            
            title.textContent = `Scouting Results: ${prospectTemplates[country].flag} ${country.toUpperCase()}`;
            
            let html = '<div class="prospects-list">';
            prospects.forEach(prospect => {
                html += `
                    <div class="prospect-card">
                        <h4>${prospect.flag} ${prospect.name} (Age: ${prospect.age})</h4>
                        <p><strong>Sport:</strong> ${prospect.sport} | <strong>Specialty:</strong> ${prospect.specialty}</p>
                        <p><strong>Potential:</strong> ${prospect.potential}/100</p>
                        <div style="margin: 10px 0;">
                            <small>Strength: ${prospect.skills.strength} | Speed: ${prospect.skills.speed} | 
                            Intelligence: ${prospect.skills.intelligence} | Technique: ${prospect.skills.technique}</small>
                        </div>
                        ${prospect.backstory ? `<p><em>${prospect.backstory}</em></p>` : ''}
                        <button class="recruit-btn" onclick="recruitProspect(${prospect.id}, ${prospect.cost})">
                            Recruit ($${prospect.cost})
                        </button>
                        <div style="clear: both;"></div>
                    </div>
                `;
            });
            html += '</div>';
            
            content.innerHTML = html;
            modal.style.display = 'block';
            
            // Store prospects temporarily
            window.currentProspects = prospects;
        }

        function recruitProspect(prospectId, cost) {
            if (gameState.money < cost) {
                logMessage("❌ Not enough money to recruit this prospect! Need $" + cost + "");
                return;
            }

            // Check facility capacity
            const totalCapacity = gameState.facilities.arizona.capacity + gameState.facilities.europe.capacity;
            if (gameState.athletes.length >= totalCapacity) {
                logMessage("❌ No space in facilities! Upgrade your facilities first.");
                return;
            }

            const prospect = window.currentProspects.find(p => p.id === prospectId);
            if (prospect) {
                gameState.money -= cost;
                gameState.athletes.push(prospect);
                
                logMessage("✅ Recruited " + prospect.flag + " " + prospect.name + " for $" + cost + "!");
                updateUI();
                
                // Remove recruited prospect from modal
                event.target.parentElement.style.display = 'none';
            }
        }

        // Nutrition system
        function feedAthletes(nutritionType) {
            if (gameState.athletes.length === 0) {
                logMessage("❌ No athletes to feed!");
                return;
            }

            let cost = 0;
            let powderCost = 0;
            let effect = '';

            switch (nutritionType) {
                case 'watermelon':
                    if (gameState.watermelons < gameState.athletes.length) {
                        logMessage("❌ Not enough watermelons! Need " + gameState.athletes.length + "");
                        return;
                    }
                    gameState.watermelons -= gameState.athletes.length;
                    effect = 'Basic nutrition - maintains health';
                    break;
                case 'protein':
                    cost = 100 * gameState.athletes.length;
                    powderCost = Math.ceil(gameState.athletes.length / 2);
                    if (gameState.money < cost || gameState.powders < powderCost) {
                        logMessage("❌ Not enough resources! Need $" + cost + " and $" + powderCost + " powders");
                        return;
                    }
                    gameState.money -= cost;
                    gameState.powders -= powderCost;
                    gameState.athletes.forEach(a => a.skills.strength += 5);
                    effect = '+Strength boost';
                    break;
                case 'focus':
                    cost = 100 * gameState.athletes.length;
                    powderCost = Math.ceil(gameState.athletes.length / 2);
                    if (gameState.money < cost || gameState.powders < powderCost) {
                        logMessage("❌ Not enough resources! Need $" + cost + " and $" + powderCost + " powders");
                        return;
                    }
                    gameState.money -= cost;
                    gameState.powders -= powderCost;
                    gameState.athletes.forEach(a => a.skills.intelligence += 5);
                    effect = '+Intelligence boost';
                    break;
                case 'speed':
                    cost = 100 * gameState.athletes.length;
                    powderCost = Math.ceil(gameState.athletes.length / 2);
                    if (gameState.money < cost || gameState.powders < powderCost) {
                        logMessage("❌ Not enough resources! Need $" + cost + " and $" + powderCost + " powders");
                        return;
                    }
                    gameState.money -= cost;
                    gameState.powders -= powderCost;
                    gameState.athletes.forEach(a => a.skills.speed += 5);
                    effect = '+Speed boost';
                    break;
                default:
                    logMessage('❌ Unknown nutrition type!');
                    return;
            }
            logMessage("🍉 Fed athletes: " + effect + "");
            updateUI();
        }

        function buySupplies() {
            if (gameState.money < 500) {
                logMessage('❌ Not enough money to buy supplies!');
                return;
            }
            gameState.money -= 500;
            gameState.watermelons += 10;
            gameState.powders += 2;
            logMessage('🛒 Bought 10 watermelons and 2 powders!');
            updateUI();
        }

        function upgradeFacility(facility) {
            const costs = { arizona: 20000, europe: 25000 };
            if (gameState.money < costs[facility]) {
                logMessage("❌ Not enough money to upgrade " + facility + "! Need $" + costs[facility] + "");
                return;
            }
            gameState.money -= costs[facility];
            gameState.facilities[facility].level += 1;
            gameState.facilities[facility].capacity += 5;
            logMessage("🏢 Upgraded " + facility + " facility!");
            updateUI();
        }

        function enterTournament(tournament) {
            const requirements = {
                local: { fee: 1000, minSkill: 30, prize: 5000, rep: 5 },
                regional: { fee: 5000, minSkill: 60, prize: 20000, rep: 15 },
                international: { fee: 15000, minSkill: 90, prize: 100000, rep: 50 }
            };
            const req = requirements[tournament];
            if (gameState.money < req.fee) {
                logMessage("❌ Not enough money for entry fee! Need $" + req.fee + "");
                return;
            }
            const eligible = gameState.athletes.some(a =>
                a.skills.strength >= req.minSkill ||
                a.skills.speed >= req.minSkill ||
                a.skills.intelligence >= req.minSkill ||
                a.skills.technique >= req.minSkill
            );
            if (!eligible) {
                logMessage("❌ No eligible athletes for this tournament! Need skill level " + req.minSkill + "+");
                return;
            }
            gameState.money -= req.fee;
            gameState.money += req.prize;
            gameState.reputation += req.rep;
            logMessage("🏅 Won " + tournament + " tournament! Prize: $" + req.prize + ", Reputation: +" + req.rep + "");
            updateUI();
        }

        function updateUI() {
            document.getElementById('money').textContent = gameState.money;
            document.getElementById('reputation').textContent = gameState.reputation;
            document.getElementById('athleteCount').textContent = gameState.athletes.length;
            document.getElementById('watermelons').textContent = gameState.watermelons;
            document.getElementById('powders').textContent = gameState.powders;
            document.getElementById('watermelonCount').textContent = gameState.watermelons;
            document.getElementById('arizonaLevel').textContent = gameState.facilities.arizona.level;
            document.getElementById('arizonaCapacity').textContent = gameState.facilities.arizona.capacity;
            document.getElementById('arizonaCost').textContent = 20000 * gameState.facilities.arizona.level;
            document.getElementById('europeLevel').textContent = gameState.facilities.europe.level;
            document.getElementById('europeCapacity').textContent = gameState.facilities.europe.capacity;
            document.getElementById('europeCost').textContent = 25000 * gameState.facilities.europe.level;
            // Update athlete roster
            const roster = document.getElementById('athleteRoster');
            if (gameState.athletes.length === 0) {
                roster.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No athletes recruited yet. Visit the World Scouting tab to find talent!</div>';
            } else {
                roster.innerHTML = gameState.athletes.map(a => `
                    <div class="athlete-card">
                        <h4>${a.flag} ${a.name} (${a.sport})</h4>
                        <p>Age: ${a.age} | Specialty: ${a.specialty}</p>
                        <div class="skill-bar"><div class="skill-fill" style="width: ${a.skills.strength}%"></div></div>
                        <small>Strength: ${a.skills.strength}</small>
                        <div class="skill-bar"><div class="skill-fill" style="width: ${a.skills.speed}%"></div></div>
                        <small>Speed: ${a.skills.speed}</small>
                        <div class="skill-bar"><div class="skill-fill" style="width: ${a.skills.intelligence}%"></div></div>
                        <small>Intelligence: ${a.skills.intelligence}</small>
                        <div class="skill-bar"><div class="skill-fill" style="width: ${a.skills.technique}%"></div></div>
                        <small>Technique: ${a.skills.technique}</small>
                        <p>Potential: ${a.potential}/100</p>
                        <p>Happiness: ${a.happiness} | Health: ${a.health}</p>
                    </div>
                `).join('');
            }
        }

        function logMessage(msg) {
            const log = document.getElementById('gameLog');
            log.innerHTML += `<div>${msg}</div>`;
            log.scrollTop = log.scrollHeight;
        }

        // Modal close
        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = function() {
                btn.parentElement.parentElement.style.display = 'none';
            };
        });

        // Start game
        window.onload = initGame;
    </script>
</body>
</html>