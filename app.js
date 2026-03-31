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

    // --- Premium Currency Converter Logic ---
    const premiumFab = document.getElementById("premium-fab");
    const paymentModal = document.getElementById("payment-modal");
    const converterModal = document.getElementById("converter-modal");
    
    const closePaymentBtn = document.getElementById("close-payment-modal");
    const closeConverterBtn = document.getElementById("close-converter-modal");
    const paymentForm = document.getElementById("payment-form");
    
    const usdInput = document.getElementById("usd-input");
    const mxnResult = document.getElementById("mxn-result");
    const currentRateDisplay = document.getElementById("current-rate-display");
    
    const triggerScanBtn = document.getElementById("trigger-scan-btn");
    const cameraInput = document.getElementById("camera-input");
    const scanStatus = document.getElementById("scan-status");

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
    
    // Convert logic
    function convertUSDToMXN() {
        const usdVal = parseFloat(usdInput.value);
        if (isNaN(usdVal)) {
            mxnResult.textContent = "$0.00 MXN";
            return;
        }
        const mxnVal = (usdVal * mxnExchangeRate).toFixed(2);
        mxnResult.textContent = `$${mxnVal} MXN`;
    }

    usdInput.addEventListener("input", convertUSDToMXN);

    function checkPremiumStatus() {
        return localStorage.getItem("heyNeighborPremium") === "true";
    }

    premiumFab.addEventListener("click", () => {
        if (checkPremiumStatus()) {
            premiumFab.classList.add("unlocked");
            converterModal.style.display = "flex";
            if (currentRateDisplay.textContent === "Loading...") {
                fetchExchangeRate();
            }
        } else {
            paymentModal.style.display = "flex";
        }
    });

    closePaymentBtn.addEventListener("click", () => {
        paymentModal.style.display = "none";
    });

    closeConverterBtn.addEventListener("click", () => {
        converterModal.style.display = "none";
        usdInput.value = "";
        mxnResult.textContent = "$0.00 MXN";
        scanStatus.style.display = "none";
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
            
            // Open converter directly
            converterModal.style.display = "flex";
            if (currentRateDisplay.textContent === "Loading...") {
                fetchExchangeRate();
            }
        }, 1500); // 1.5s delay mimic
    });

    // Initialize FAB look if already premium
    if (checkPremiumStatus()) {
        premiumFab.classList.add("unlocked");
    }

    // --- OCR Logic ---
    triggerScanBtn.addEventListener("click", () => {
        cameraInput.click();
    });

    cameraInput.addEventListener("change", async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        scanStatus.style.display = "block";
        scanStatus.innerHTML = '<i class="uil uil-spinner uil-spin"></i> Analyzing image...';
        triggerScanBtn.disabled = true;

        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            
            console.log("OCR Result:", text);
            // Regex to find things like $15.99, 15.99, 15, etc.
            const regex = /(?:\$)?\s*(\d+(?:\.\d{2})?)/;
            const match = text.match(regex);
            
            if (match && match[1]) {
                usdInput.value = match[1];
                convertUSDToMXN();
                scanStatus.innerHTML = '<i class="uil uil-check-circle" style="color:var(--clr-green-dark)"></i> Price found!';
            } else {
                scanStatus.innerHTML = '<i class="uil uil-exclamation-circle" style="color:red"></i> No price detected. Try again.';
            }
        } catch (error) {
            console.error("OCR Error:", error);
            scanStatus.innerHTML = '<i class="uil uil-times-circle" style="color:red"></i> Error analyzing image.';
        } finally {
            triggerScanBtn.disabled = false;
            cameraInput.value = ""; // reset
        }
    });

});
