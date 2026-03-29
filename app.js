document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("places-grid");
    const filtersContainer = document.getElementById("category-filters");
    
    // Extract unique categories from placesData (which is loaded via data.js)
    const categories = ["All", ...new Set(placesData.map(place => place.category))];
    
    let currentCategory = "All";

    function renderFilters() {
        filtersContainer.innerHTML = "";
        categories.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${cat === currentCategory ? "active" : ""}`;
            btn.textContent = cat;
            btn.addEventListener("click", () => {
                currentCategory = cat;
                renderFilters(); // update active class
                renderPlaces();
            });
            filtersContainer.appendChild(btn);
        });
    }

    function renderPlaces() {
        grid.innerHTML = "";
        
        const filteredPlaces = currentCategory === "All" 
            ? placesData 
            : placesData.filter(place => place.category === currentCategory);

        filteredPlaces.forEach(place => {
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}" class="card-img" loading="lazy">
                <div class="card-content">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${place.name}</h3>
                            <span class="card-category">${place.category}</span>
                        </div>
                        <div class="card-rating">
                            <i class="uil uil-star"></i> ${place.rating}
                        </div>
                    </div>
                    <p class="card-desc">${place.description}</p>
                    <div class="card-footer">
                        <span class="badge ${place.speaksEnglish ? 'badge-english-yes' : 'badge-english-no'}">
                            ${place.speaksEnglish ? '<i class="uil uil-comment-alt-check"></i> English' : 'Spanish Only'}
                        </span>
                        <a href="${place.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-map">
                            <i class="uil uil-map-marker"></i> Google Maps
                        </a>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    // --- Authentication & Initialization Logic ---
    const loginContainer = document.getElementById("login-container");
    const appContainer = document.getElementById("app-container");
    const loginForm = document.getElementById("login-form");
    const welcomeHeading = document.getElementById("welcome-heading");

    function initApp() {
        const savedUser = localStorage.getItem("heyNeighborUser");
        
        if (savedUser) {
            // User exists, show app and personalize
            const userData = JSON.parse(savedUser);
            loginContainer.style.display = "none";
            appContainer.style.display = "block";
            welcomeHeading.innerHTML = `Hey ${userData.name}! <i class="uil uil-smile"></i>`;
            
            // Render logic
            renderFilters();
            renderPlaces();
        } else {
            // No user, show login
            loginContainer.style.display = "flex"; // CSS handles the layout
            appContainer.style.display = "none";
        }
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload
        
        const userData = {
            name: document.getElementById("user-name").value,
            email: document.getElementById("user-email").value,
            nationality: document.getElementById("user-nationality").value,
            age: document.getElementById("user-age").value,
            language: document.getElementById("user-language").value
        };
        
        // Save to browser storage
        localStorage.setItem("heyNeighborUser", JSON.stringify(userData));
        
        // Initialize the app with the new user
        initApp();
    });

    // Run initialization on load
    initApp();
});
