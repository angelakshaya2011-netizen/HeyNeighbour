document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("places-grid");
    const filtersContainer = document.getElementById("category-filters");
    
    // Extract unique categories from placesData (which is loaded via data.js)
    const categories = ["All", ...new Set(placesData.map(place => place.category))];
    
    let currentCategory = "All";
    let currentSearchTerm = "";
    let dropdownOpen = false;

    function getCategoryIcon(cat) {
        const icons = {
            "All": "uil-apps",
            "Restaurants": "uil-restaurant",
            "Clothing": "uil-shopping-bag",
            "Hair Salons": "uil-scissors",
            "Vets": "uil-paw"
        };
        return icons[cat] || "uil-tag-alt";
    }

    function buildDropdown() {
        const list = document.getElementById("category-dropdown-list");
        if (!list) return;
        list.innerHTML = "";
        categories.forEach(cat => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.innerHTML = `<i class="uil ${getCategoryIcon(cat)}"></i> ${cat}`;
            item.addEventListener("click", () => selectCategory(cat));
            list.appendChild(item);
        });
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
        const list = document.getElementById("category-dropdown-list");
        const arrow = document.getElementById("dropdown-arrow");
        list.style.display = dropdownOpen ? "block" : "none";
        if (arrow) arrow.style.transform = dropdownOpen ? "rotate(180deg)" : "";
    }

    function selectCategory(cat) {
        currentCategory = cat;
        currentSearchTerm = "";
        dropdownOpen = false;

        const list = document.getElementById("category-dropdown-list");
        const arrow = document.getElementById("dropdown-arrow");
        const dropdownWrapper = document.getElementById("category-dropdown-wrapper");
        const searchSection = document.getElementById("search-bar-section");
        const searchInput = document.getElementById("place-search-input");
        const clearBtn = document.getElementById("clear-search-btn");

        if (list) list.style.display = "none";
        if (arrow) arrow.style.transform = "";
        if (dropdownWrapper) dropdownWrapper.style.display = "none";
        if (searchSection) {
            searchSection.style.display = "flex";
            if (searchInput) {
                searchInput.placeholder = cat === "All" ? "Search all places..." : `Search within ${cat}...`;
                searchInput.value = "";
                searchInput.focus();
            }
            if (clearBtn) clearBtn.style.display = "none";
        }
        renderPlaces();
    }

    function backToDropdown() {
        currentCategory = "All";
        currentSearchTerm = "";
        dropdownOpen = false;

        const dropdownWrapper = document.getElementById("category-dropdown-wrapper");
        const searchSection = document.getElementById("search-bar-section");
        const list = document.getElementById("category-dropdown-list");
        const arrow = document.getElementById("dropdown-arrow");

        if (searchSection) searchSection.style.display = "none";
        if (dropdownWrapper) dropdownWrapper.style.display = "block";
        if (list) list.style.display = "none";
        if (arrow) arrow.style.transform = "";
        renderPlaces();
    }

    function renderPlaces() {
        grid.innerHTML = "";

        let filtered = currentCategory === "All"
            ? placesData
            : placesData.filter(place => place.category === currentCategory);

        if (currentSearchTerm.trim()) {
            const term = currentSearchTerm.toLowerCase().trim();
            filtered = filtered.filter(place =>
                place.name.toLowerCase().includes(term) ||
                place.description.toLowerCase().includes(term) ||
                place.category.toLowerCase().includes(term)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:2rem; grid-column: 1 / -1; font-size:1.1rem;">No results found for "<strong>${currentSearchTerm}</strong>".</p>`;
            return;
        }

        filtered.forEach(place => {
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
                        <div class="card-badges">
                            <span class="badge ${place.speaksEnglish ? 'badge-english-yes' : 'badge-english-no'}">
                                ${place.speaksEnglish ? '<i class="uil uil-comment-alt-check"></i> English' : 'Spanish Only'}
                            </span>
                            ${place.category === 'Restaurants' ? `
                            <span class="badge ${place.vegetarianOptions ? 'badge-veg-yes' : 'badge-veg-no'}">
                                ${place.vegetarianOptions ? '🌿 Veg Friendly' : '🍖 Not Veg'}
                            </span>` : ''}
                        </div>
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
    const premiumFab = document.getElementById("premium-fab");

    function initApp() {
        const savedUser = localStorage.getItem("heyNeighborUser");
        
        if (savedUser) {
            // User exists, show app and personalize
            const userData = JSON.parse(savedUser);
            loginContainer.style.display = "none";
            appContainer.style.display = "block";
            welcomeHeading.innerHTML = `Hey ${userData.name}! <i class="uil uil-smile"></i>`;
            
            // Show FAB and restore premium look if applicable
            premiumFab.style.display = "flex";
            if (checkPremiumStatus()) {
                premiumFab.classList.add("unlocked");
            } else {
                premiumFab.classList.remove("unlocked");
            }

            // Render logic
            buildDropdown();
            renderPlaces();
        } else {
            // No user — hide everything and show login
            loginContainer.style.display = "flex";
            appContainer.style.display = "none";
            premiumFab.style.display = "none";
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

    // --- Dropdown & Search Event Listeners ---
    const dropdownBtn = document.getElementById("category-dropdown-btn");
    if (dropdownBtn) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (dropdownOpen) {
            const wrapper = document.getElementById("category-dropdown-wrapper");
            if (wrapper && !wrapper.contains(e.target)) {
                dropdownOpen = false;
                const list = document.getElementById("category-dropdown-list");
                const arrow = document.getElementById("dropdown-arrow");
                if (list) list.style.display = "none";
                if (arrow) arrow.style.transform = "";
            }
        }
    });

    const backBtn = document.getElementById("back-to-categories-btn");
    if (backBtn) backBtn.addEventListener("click", backToDropdown);

    const placeSearchInput = document.getElementById("place-search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");

    if (placeSearchInput) {
        placeSearchInput.addEventListener("input", (e) => {
            currentSearchTerm = e.target.value;
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearchTerm ? "flex" : "none";
            }
            renderPlaces();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            currentSearchTerm = "";
            if (placeSearchInput) placeSearchInput.value = "";
            clearSearchBtn.style.display = "none";
            renderPlaces();
        });
    }

    // --- Premium Currency Converter Logic ---
    const paymentModal = document.getElementById("payment-modal");
    const dashboardModal = document.getElementById("dashboard-modal");
    const converterModal = document.getElementById("converter-modal");
    const eventsScreen = document.getElementById("events-screen");
    
    const closePaymentBtn = document.getElementById("close-payment-modal");
    const closeDashboardBtn = document.getElementById("close-dashboard-modal");
    const closeConverterBtn = document.getElementById("close-converter-modal");
    const closeEventsScreenBtn = document.getElementById("close-events-screen-btn");
    
    const openConverterBtn = document.getElementById("open-converter-btn");
    const openEventsBtn = document.getElementById("open-events-btn");
    
    const paymentForm = document.getElementById("payment-form");
    
    const mxnInput = document.getElementById("mxn-input");
    const usdResult = document.getElementById("usd-result");
    const currentRateDisplay = document.getElementById("current-rate-display");
    
    let mxnExchangeRate = 17.00; // Fallback default rate

    // Fetch live rate
    async function fetchExchangeRate() {
        try {
            const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            const data = await res.json();
            if (data && data.rates && data.rates.MXN) {
                mxnExchangeRate = data.rates.MXN;
            }
        } catch (error) {
            console.error("Could not fetch live exchange rate. Using fallback.");
        }
        currentRateDisplay.textContent = mxnExchangeRate.toFixed(2);
    }
    
    // Convert logic (MXN to USD)
    function convertMXNToUSD() {
        const mxnVal = parseFloat(mxnInput.value);
        if (isNaN(mxnVal) || mxnExchangeRate === 0) {
            usdResult.textContent = "$0.00 USD";
            return;
        }
        const usdVal = (mxnVal / mxnExchangeRate).toFixed(2);
        usdResult.textContent = `$${usdVal} USD`;
    }

    mxnInput.addEventListener("input", convertMXNToUSD);

    function checkPremiumStatus() {
        return localStorage.getItem("heyNeighborPremium") === "true";
    }

    premiumFab.addEventListener("click", () => {
        if (checkPremiumStatus()) {
            premiumFab.classList.add("unlocked");
            dashboardModal.style.display = "flex";
        } else {
            paymentModal.style.display = "flex";
        }
    });

    closePaymentBtn.addEventListener("click", () => {
        paymentModal.style.display = "none";
    });

    closeDashboardBtn.addEventListener("click", () => {
        dashboardModal.style.display = "none";
    });

    openConverterBtn.addEventListener("click", () => {
        dashboardModal.style.display = "none";
        converterModal.style.display = "flex";
        if (currentRateDisplay.textContent === "Loading...") {
            fetchExchangeRate();
        }
    });

    openEventsBtn.addEventListener("click", () => {
        dashboardModal.style.display = "none";
        appContainer.style.display = "none";
        premiumFab.style.display = "none";
        eventsScreen.style.display = "block";
        window.scrollTo(0,0);
        renderPremiumEvents(""); 
    });

    closeEventsScreenBtn.addEventListener("click", () => {
        eventsScreen.style.display = "none";
        appContainer.style.display = "block";
        premiumFab.style.display = "flex";
    });

    closeConverterBtn.addEventListener("click", () => {
        converterModal.style.display = "none";
        mxnInput.value = "";
        usdResult.textContent = "$0.00 USD";
    });

    // Mock Payment Submit
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const payBtn = document.getElementById("pay-btn");
        const originalText = payBtn.textContent;
        payBtn.textContent = "Processing...";
        payBtn.disabled = true;
        
        setTimeout(() => {
            localStorage.setItem("heyNeighborPremium", "true");
            payBtn.textContent = originalText;
            payBtn.disabled = false;
            paymentModal.style.display = "none";
            premiumFab.classList.add("unlocked");
            
            // Open dashboard directly instead of converter
            dashboardModal.style.display = "flex";
        }, 1500); // 1.5s delay mimic
    });



    // --- Premium Events Logic ---
    const eventsSearchInput = document.getElementById("events-search-input");
    const eventsList = document.getElementById("events-list");

    function renderPremiumEvents(query) {
        eventsList.innerHTML = "";
        const lowerQuery = query.toLowerCase().trim();
        
        let filteredEvents = eventsData;
        if (lowerQuery !== "") {
            filteredEvents = eventsData.filter(event => 
                event.title.toLowerCase().includes(lowerQuery) || 
                event.culture.toLowerCase().includes(lowerQuery) ||
                event.location.toLowerCase().includes(lowerQuery)
            );
        }

        if (filteredEvents.length === 0) {
            eventsList.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:2rem; grid-column: 1 / -1;">No events found matching your search.</p>';
            return;
        }

        filteredEvents.forEach(evt => {
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <img src="${evt.imageUrl}" alt="${evt.title}" class="card-img" loading="lazy">
                <div class="card-content">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${evt.title}</h3>
                            <span class="card-category" style="background-color: var(--clr-lila);">${evt.culture}</span>
                        </div>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--clr-blue-dark); font-weight: 500;">
                        <i class="uil uil-calendar-alt"></i> ${evt.date}
                        &nbsp; | &nbsp; 
                        <i class="uil uil-map-marker"></i> ${evt.location}
                    </div>
                    <p class="card-desc" style="margin-top: 0.5rem;">${evt.description}</p>
                    <div class="card-footer" style="justify-content: flex-end;">
                        <a href="${evt.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-map">
                            <i class="uil uil-map-marker"></i> Google Maps
                        </a>
                    </div>
                </div>
            `;
            
            eventsList.appendChild(card);
        });
    }

    eventsSearchInput.addEventListener("input", (e) => {
        renderPremiumEvents(e.target.value);
    });

    // --- Profile & Logout Logic ---
    const profileBtn = document.getElementById("profile-btn");
    const profileModal = document.getElementById("profile-modal");
    const closeProfileBtn = document.getElementById("close-profile-modal");
    const profileForm = document.getElementById("profile-form");
    const logoutBtn = document.getElementById("logout-btn");

    function populateProfileForm() {
        const savedUser = localStorage.getItem("heyNeighborUser");
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            document.getElementById("edit-user-name").value = userData.name || "";
            document.getElementById("edit-user-email").value = userData.email || "";
            document.getElementById("edit-user-nationality").value = userData.nationality || "USA";
            document.getElementById("edit-user-age").value = userData.age || "";
            document.getElementById("edit-user-language").value = userData.language || "English";
        }
    }

    profileBtn.addEventListener("click", () => {
        populateProfileForm();
        profileModal.style.display = "flex";
    });

    closeProfileBtn.addEventListener("click", () => {
        profileModal.style.display = "none";
    });

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById("edit-user-name").value,
            email: document.getElementById("edit-user-email").value,
            nationality: document.getElementById("edit-user-nationality").value,
            age: document.getElementById("edit-user-age").value,
            language: document.getElementById("edit-user-language").value
        };
        localStorage.setItem("heyNeighborUser", JSON.stringify(userData));
        profileModal.style.display = "none";
        initApp(); // re-render welcome message and places based on new data if needed
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("heyNeighborUser");
        // Preserve 'heyNeighborPremium' so the device remembers on next login
        profileModal.style.display = "none";
        premiumFab.style.display = "none"; // hide FAB immediately on logout
        initApp(); // will detect no user and show login screen
    });

});
