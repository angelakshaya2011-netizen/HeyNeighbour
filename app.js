document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("places-grid");
    const filtersContainer = document.getElementById("category-filters");

    // --- Translation Configuration ---
    let translationCache = JSON.parse(localStorage.getItem("heyNeighborTranslations") || "{}");
    const saveTranslations = () => localStorage.setItem("heyNeighborTranslations", JSON.stringify(translationCache));

    async function translateText(text, targetLang) {
        if (!targetLang || targetLang === 'en' || !text) return text;
        
        const cacheKey = `${targetLang}:${text}`;
        if (translationCache[cacheKey]) return translationCache[cacheKey];

        try {
            // Using a proxy to bypass CORS for Google Translate gtx endpoint
            const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
            const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(proxyUrl + encodeURIComponent(translateUrl));
            const data = await response.json();
            
            // Google Translate gtx response format: [[["Translated Text", "Source Text", null, null, 3], ...], null, "en"]
            const translated = data[0].map(item => item[0]).join('');
            
            translationCache[cacheKey] = translated;
            saveTranslations();
            return translated;
        } catch (error) {
            console.error("Translation error:", error);
            return text; // Fallback to original
        }
    }

    const uiStrings = {
        welcome_heading: "Hey {name}! \u{1F60A}",
        header_subtext: "Here are the best spots in GDL, that the community recommends!",
        label_language: "Language",
        search_placeholder: "Search {cat}...",
        search_all: "Search all places...",
        btn_maps: "Google Maps",
        badge_english: "English",
        badge_spanish_only: "Spanish Only",
        badge_veg: "\u{1F33F} Vegetarian Options",
        badge_not_veg: "\u{1F356} Not Veg",
        badge_family: "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466} Family Friendly",
        badge_adults: "\u{1F51E} Adults Only",
        login_title: "Welcome to Guadalajara, Mexico!",
        login_subtitle: "Please tell us a bit about yourself so we can personalize your experience.",
        ph_name: "Your Name",
        ph_email: "Your Email",
        ph_nationality: "Your Nationality",
        ph_age: "Your Age",
        btn_start: "Start Exploring",
        verify_title: "Verify Your Email",
        verify_subtitle: "We've sent a 4-digit code to {email}.",
        btn_back: "Go Back",
        btn_verify: "Verify Code",
        nav_browse: "Browse Categories",
        btn_premium: "Premium",
        btn_download: "Download App",
        premium_title: "Unlock Premium",
        premium_subtitle: "Get access to the live currency converter AND the Cultural Events searcher!",
        profile_title: "Your Profile",
        profile_subtitle: "Update your details below.",
        btn_save: "Save Changes",
        btn_logout: "Log Out",
        premium_features_title: "Premium Features",
        premium_features_subtitle: "Select a feature to use.",
        btn_dashboard_converter: "Currency Converter",
        btn_dashboard_events: "Cultural Events Search",
        btn_back_dashboard: "Back to Dashboard",
        btn_dashboard_units: "Unit Converter",
        events_title: "Cultural Events",
        events_subtitle: "Find international festivals and events near you.",
        survey_title: "What can we do better?",
        survey_subtitle: "We'd love to hear your thoughts on how we can improve \"Hey Neighbor\"."
    };

    async function updateUILanguage() {
        const userData = JSON.parse(localStorage.getItem("heyNeighborUser") || "{}");
        const lang = userData.language || "en";
        
        // Translate static elements with data-i18n
        const translatable = document.querySelectorAll("[data-i18n]");
        for (const el of translatable) {
            const key = el.getAttribute("data-i18n");
            let original = uiStrings[key] || el.textContent;
            
            if (key === 'welcome_heading') {
                original = original.replace("{name}", userData.name || "Neighbor");
            }
            if (key === 'verify_subtitle') {
                original = original.replace("{email}", userData.email || "");
            }
            
            const translated = await translateText(original, lang);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translated;
            } else if (el.tagName === 'LABEL' && el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') {
                // If it's a label for an input, translate it normally
                el.textContent = translated;
            } else {
                // Specific handling for icons
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = `${icon.outerHTML} ${translated}`;
                } else {
                    el.textContent = translated;
                }
            }
        }
    }

    // --- Populate Nationalities ---
    const allNationalities = [
        "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian/Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
    ];

    const datalist = document.getElementById('nationalities');
    if (datalist) {
        allNationalities.forEach(nat => {
            const option = document.createElement('option');
            option.value = nat;
            datalist.appendChild(option);
        });
    }

    // Extract unique categories from placesData (which is loaded via data.js)
    const categories = ["All", ...new Set(placesData.map(place => place.category))];

    let currentCategory = "All";
    let currentSearchTerm = "";
    let dropdownOpen = false;

    function getCategoryEmoji(cat) {
        const emojis = {
            "All": "🌍",
            "Restaurants": "🍽️",
            "Clothing": "👕",
            "Hair Salons": "✂️",
            "Vets": "🐾",
            "Clinics": "🏥",
            "Entertainment": "🎭"
        };
        return emojis[cat] || "🏷️";
    }

    function buildDropdown() {
        const list = document.getElementById("category-dropdown-list");
        if (!list) return;
        list.innerHTML = "";
        categories.forEach(cat => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.innerHTML = `<span style="font-size: 1.2em; margin-right: 8px;">${getCategoryEmoji(cat)}</span> ${cat}`;
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
            filtered = filtered.filter(place => {
                const searchTokens = [
                    place.name,
                    place.description,
                    place.category,
                    place.speaksEnglish ? 'english speaking english' : 'spanish only',
                    place.vegetarianOptions ? 'vegetarian veg options friendly' : '',
                    place.familyFriendly ? 'family friendly kids familiar' : 'adults only'
                ].join(' ').toLowerCase();

                return searchTokens.includes(term);
            });
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
                            <span class="card-category">${getCategoryEmoji(place.category)} ${place.category}</span>
                        </div>
                        <div class="card-rating">
                            <i class="uil uil-star"></i> ${place.rating}
                        </div>
                    </div>
                    <p class="card-desc" id="desc-${place.id}">${place.description}</p>
                    <div class="card-footer">
                        <div class="card-badges">
                            <span class="badge ${place.speaksEnglish ? 'badge-english-yes' : 'badge-english-no'}">
                                ${place.speaksEnglish ? '<i class="uil uil-comment-alt-check"></i> English' : 'Spanish Only'}
                            </span>
                            ${place.category === 'Restaurants' ? `
                            <span class="badge ${place.vegetarianOptions ? 'badge-veg-yes' : 'badge-veg-no'}">
                                ${place.vegetarianOptions ? '🌿 Vegetarian Options' : '🍖 Not Veg'}
                            </span>` : ''}
                            ${place.category === 'Entertainment' ? `
                            <span class="badge ${place.familyFriendly ? 'badge-veg-yes' : 'badge-veg-no'}">
                                ${place.familyFriendly ? '👨‍👩‍👧‍👦 Family Friendly' : '🔞 Adults Only'}
                            </span>` : ''}
                        </div>
                        <a href="${place.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-map" data-i18n="btn_maps">
                            <i class="uil uil-map-marker"></i> Google Maps
                        </a>
                    </div>
                </div>
            `;

            grid.appendChild(card);

            // Fetch translation asynchronously
            const user = JSON.parse(localStorage.getItem("heyNeighborUser") || "{}");
            if (user.language && user.language !== 'en') {
                translateText(place.description, user.language).then(translated => {
                    const descEl = document.getElementById(`desc-${place.id}`);
                    if (descEl) descEl.textContent = translated;
                });
            }
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
            
            // Personalized welcome - will be updated by UI translation
            welcomeHeading.innerHTML = `Hey ${userData.name}! <i class="uil uil-smile"></i>`;

            // Run UI translation
            updateUILanguage();

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
            
            // Check for onboarding
            const onboarded = localStorage.getItem("heyNeighborOnboarded");
            if (!onboarded) {
                document.getElementById("instruction-modal").style.display = "flex";
            }
        } else {
            // No user — hide everything and show login
            loginContainer.style.display = "flex";
            appContainer.style.display = "none";
            premiumFab.style.display = "none";
        }
    }

    let tempUserData = null;
    let currentVerificationCode = null;

    const verificationForm = document.getElementById("verification-form");
    const verifyEmailDisplay = document.getElementById("verify-email-display");
    const btnBackLogin = document.getElementById("btn-back-login");

    // --- Instruction Modal Logic ---
    const instructionModal = document.getElementById("instruction-modal");
    const closeInstructionBtn = document.getElementById("close-instruction-btn");
    const helpBtn = document.getElementById("help-btn");

    if (helpBtn) {
        helpBtn.addEventListener("click", () => {
            instructionModal.style.display = "flex";
        });
    }

    if (closeInstructionBtn) {
        closeInstructionBtn.addEventListener("click", () => {
            instructionModal.style.display = "none";
            localStorage.setItem("heyNeighborOnboarded", "true");
        });
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        tempUserData = {
            name: document.getElementById("user-name").value,
            email: document.getElementById("user-email").value,
            nationality: document.getElementById("user-nationality").value,
            age: document.getElementById("user-age").value,
            language: document.getElementById("user-language").value
        };

        // Generate random 4-digit code
        currentVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Simulate sending email
        alert("SIMULATED EMAIL:\n\nHello " + tempUserData.name + ",\nYour verification code is: " + currentVerificationCode);

        // Update UI
        verifyEmailDisplay.textContent = tempUserData.email;
        loginForm.style.display = "none";
        verificationForm.style.display = "block";
        document.getElementById("verify-code").value = "";
    });

    verificationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredCode = document.getElementById("verify-code").value;

        if (enteredCode === currentVerificationCode) {
            // Success!
            localStorage.setItem("heyNeighborUser", JSON.stringify(tempUserData));
            // Cleanup UI states for next time
            verificationForm.style.display = "none";
            loginForm.style.display = "flex";
            loginForm.reset();
            currentVerificationCode = null;
            tempUserData = null;

            // Show splash instead of direct boot
            loginContainer.style.display = "none";
            const splashScreen = document.getElementById("splash-screen");
            if (splashScreen) {
                splashScreen.style.display = "flex";

                // Allow browser to render display flex fully
                setTimeout(() => {
                    splashScreen.style.opacity = "1";

                    setTimeout(() => {
                        splashScreen.style.opacity = "0";
                        setTimeout(() => {
                            splashScreen.style.display = "none";
                            // Boot app
                            initApp();
                        }, 500); // fade out transition
                    }, 2500); // 0.5s fade in + 1.5s fully visible
                }, 50);
            } else {
                initApp();
            }
        } else {
            alert("Incorrect verification code. Please try again.");
        }
    });

    btnBackLogin.addEventListener("click", () => {
        verificationForm.style.display = "none";
        loginForm.style.display = "flex";
        currentVerificationCode = null;
        tempUserData = null;
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

    // New Multi-Currency Elements
    const fromCurrencySelect = document.getElementById("from-currency-select");
    const toCurrencySelect = document.getElementById("to-currency-select");
    const converterAmountInput = document.getElementById("converter-amount-input");
    const converterResultDisplay = document.getElementById("converter-result-display");
    const currentRateDisplay = document.getElementById("current-rate-display");
    const baseSymbolDisplay = document.getElementById("base-symbol-display");
    const targetSymbolDisplay = document.getElementById("target-symbol-display");

    let currentExchangeRates = {}; 
    let baseCurrency = "USD";
    let targetCurrency = "MXN";
    let liveUpdateInterval = null;

    const commonCurrencies = [
        "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "MXN", "INR", "BRL", "CHF", "CNY", "HKD", "NZD", "SEK", "KRW", "SGD", "NOK", "TRY", "RUB", "ZAR", "THB", "MYR", "IDR", "PHP", "TWD", "DKK", "PLN", "AED", "SAR"
    ];

    function populateCurrencyDropdowns() {
        if (!fromCurrencySelect || !toCurrencySelect) return;
        
        fromCurrencySelect.innerHTML = "";
        toCurrencySelect.innerHTML = "";
        
        commonCurrencies.sort().forEach(code => {
            const optFrom = document.createElement("option");
            optFrom.value = code;
            optFrom.textContent = code;
            if (code === baseCurrency) optFrom.selected = true;
            fromCurrencySelect.appendChild(optFrom);

            const optTo = document.createElement("option");
            optTo.value = code;
            optTo.textContent = code;
            if (code === targetCurrency) optTo.selected = true;
            toCurrencySelect.appendChild(optTo);
        });
    }

    async function fetchExchangeRate() {
        try {
            if (currentRateDisplay) currentRateDisplay.textContent = "Updating...";
            
            baseCurrency = fromCurrencySelect.value;
            targetCurrency = toCurrencySelect.value;
            
            if (baseCurrency === targetCurrency) {
                const rate = 1.0;
                currentExchangeRates = { [targetCurrency]: rate };
                if (currentRateDisplay) currentRateDisplay.textContent = rate.toFixed(4);
                if (baseSymbolDisplay) baseSymbolDisplay.textContent = baseCurrency;
                if (targetSymbolDisplay) targetSymbolDisplay.textContent = targetCurrency;
                performConversion();
                return;
            }

            const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
            // Append a cache-busting timestamp to ensure the proxy always fetches the latest rate
            const googleFinanceUrl = `https://www.google.com/finance/quote/${baseCurrency}-${targetCurrency}?hl=en&_cb=${Date.now()}`;
            
            const res = await fetch(proxyUrl + encodeURIComponent(googleFinanceUrl));
            const htmlText = await res.text();
            
            // Extract the rate exactly as it appears on Google Finance using the current HTML classes
            const match = htmlText.match(/class="YMlKec fxKbKc"[^>]*>([^<]+)/);
            
            if (match && match[1]) {
                const rateStr = match[1].replace(/,/g, '');
                const rate = parseFloat(rateStr);
                currentExchangeRates = { [targetCurrency]: rate };
                
                if (currentRateDisplay) currentRateDisplay.textContent = rate.toFixed(4);
                if (baseSymbolDisplay) baseSymbolDisplay.textContent = baseCurrency;
                if (targetSymbolDisplay) targetSymbolDisplay.textContent = targetCurrency;
                
                performConversion();
            } else {
                throw new Error("Could not parse rate from Google Finance");
            }
        } catch (error) {
            console.error("Could not fetch live exchange rate:", error);
            if (currentRateDisplay) currentRateDisplay.textContent = "Error";
        }
    }

    function performConversion() {
        const amount = parseFloat(converterAmountInput.value);
        if (isNaN(amount)) {
            converterResultDisplay.textContent = "0.00";
            return;
        }

        const rate = currentExchangeRates[targetCurrency];
        if (rate) {
            const result = (amount * rate).toFixed(2);
            // Format with currency symbol if possible, or just code
            converterResultDisplay.textContent = `${result} ${targetCurrency}`;
        }
    }

    // Listeners
    if (fromCurrencySelect) {
        fromCurrencySelect.addEventListener("change", () => {
            fetchExchangeRate();
        });
    }

    if (toCurrencySelect) {
        toCurrencySelect.addEventListener("change", () => {
            const rate = currentExchangeRates[toCurrencySelect.value];
            if (rate) {
                targetCurrency = toCurrencySelect.value;
                if (currentRateDisplay) currentRateDisplay.textContent = rate.toFixed(4);
                if (targetSymbolDisplay) targetSymbolDisplay.textContent = targetCurrency;
                performConversion();
            } else {
                fetchExchangeRate();
            }
        });
    }

    if (converterAmountInput) {
        converterAmountInput.addEventListener("input", performConversion);
    }

    // Initialize dropdowns once
    populateCurrencyDropdowns();

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

        // Always fetch immediately and start live polling every 5 seconds
        fetchExchangeRate();
        if (liveUpdateInterval) clearInterval(liveUpdateInterval);
        liveUpdateInterval = setInterval(fetchExchangeRate, 5000);
    });

    openEventsBtn.addEventListener("click", () => {
        dashboardModal.style.display = "none";
        appContainer.style.display = "none";
        premiumFab.style.display = "none";
        eventsScreen.style.display = "block";
        window.scrollTo(0, 0);
        renderPremiumEvents("");
    });

    closeEventsScreenBtn.addEventListener("click", () => {
        eventsScreen.style.display = "none";
        appContainer.style.display = "block";
        premiumFab.style.display = "flex";
    });

    closeConverterBtn.addEventListener("click", () => {
        converterModal.style.display = "none";
        if (converterAmountInput) converterAmountInput.value = "";
        if (converterResultDisplay) converterResultDisplay.textContent = "0.00";

        if (liveUpdateInterval) {
            clearInterval(liveUpdateInterval);
            liveUpdateInterval = null;
        }
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
                    <p class="card-desc" id="evt-desc-${evt.id}" style="margin-top: 0.5rem;">${evt.description}</p>
                    <div class="card-footer" style="justify-content: flex-end;">
                        <a href="${evt.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-map">
                            <i class="uil uil-map-marker"></i> Google Maps
                        </a>
                    </div>
                </div>
            `;

            eventsList.appendChild(card);

            // Fetch translation asynchronously
            const user = JSON.parse(localStorage.getItem("heyNeighborUser") || "{}");
            if (user.language && user.language !== 'en') {
                translateText(evt.description, user.language).then(translated => {
                    const descEl = document.getElementById(`evt-desc-${evt.id}`);
                    if (descEl) descEl.textContent = translated;
                });
            }
        });
    }

    eventsSearchInput.addEventListener("input", (e) => {
        renderPremiumEvents(e.target.value);
    });

    // --- Unit Converter Logic ---
    const unitConverterModal = document.getElementById("unit-converter-modal");
    const closeUnitConverterBtn = document.getElementById("close-unit-converter-modal");
    const openUnitConverterBtn = document.getElementById("open-unit-converter-btn");
    const unitCategorySelect = document.getElementById("unit-category-select");
    const unitFromSelect = document.getElementById("unit-from-select");
    const unitToSelect = document.getElementById("unit-to-select");
    const unitAmountInput = document.getElementById("unit-amount-input");
    const unitResultDisplay = document.getElementById("unit-result-display");

    const unitData = {
        "Length": {
            units: {
                "Kilometers (km)": 1000,
                "Miles (mi)": 1609.344,
                "Meters (m)": 1,
                "Feet (ft)": 0.3048,
                "Inches (in)": 0.0254
            }
        },
        "Weight": {
            units: {
                "Kilograms (kg)": 1000,
                "Pounds (lb)": 453.592,
                "Grams (g)": 1,
                "Ounces (oz)": 28.3495
            }
        },
        "Temperature": {
            special: true,
            units: {
                "Celsius (°C)": null,
                "Fahrenheit (°F)": null
            }
        },
        "Volume": {
            units: {
                "Liters (L)": 1000,
                "Gallons (gal)": 3785.41,
                "Milliliters (mL)": 1,
                "Fluid Ounces (fl oz)": 29.5735
            }
        }
    };

    function populateUnitCategory() {
        if (!unitCategorySelect) return;
        unitCategorySelect.innerHTML = "";
        Object.keys(unitData).forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            unitCategorySelect.appendChild(opt);
        });
        populateUnitSelects();
    }

    function populateUnitSelects() {
        if (!unitFromSelect || !unitToSelect || !unitCategorySelect) return;
        const category = unitCategorySelect.value;
        const units = Object.keys(unitData[category].units);

        unitFromSelect.innerHTML = "";
        unitToSelect.innerHTML = "";

        units.forEach((unit, index) => {
            const optFrom = document.createElement("option");
            optFrom.value = unit;
            optFrom.textContent = unit;
            if (index === 0) optFrom.selected = true;
            unitFromSelect.appendChild(optFrom);

            const optTo = document.createElement("option");
            optTo.value = unit;
            optTo.textContent = unit;
            if (index === 1) optTo.selected = true;
            unitToSelect.appendChild(optTo);
        });

        performUnitConversion();
    }

    function convertTemperature(value, from, to) {
        let celsius;
        if (from.startsWith("Celsius")) celsius = value;
        else if (from.startsWith("Fahrenheit")) celsius = (value - 32) * 5 / 9;
        else if (from.startsWith("Kelvin")) celsius = value - 273.15;

        if (to.startsWith("Celsius")) return celsius;
        else if (to.startsWith("Fahrenheit")) return celsius * 9 / 5 + 32;
        else if (to.startsWith("Kelvin")) return celsius + 273.15;
        return value;
    }

    function performUnitConversion() {
        if (!unitAmountInput || !unitResultDisplay) return;

        const amount = parseFloat(unitAmountInput.value);
        if (isNaN(amount)) {
            unitResultDisplay.textContent = "0.00";
            return;
        }

        const category = unitCategorySelect.value;
        const fromUnit = unitFromSelect.value;
        const toUnit = unitToSelect.value;

        let result;
        if (unitData[category].special) {
            result = convertTemperature(amount, fromUnit, toUnit);
        } else {
            const fromFactor = unitData[category].units[fromUnit];
            const toFactor = unitData[category].units[toUnit];
            result = (amount * fromFactor) / toFactor;
        }

        if (Number.isInteger(result)) {
            unitResultDisplay.textContent = `${result} ${toUnit}`;
        } else {
            unitResultDisplay.textContent = `${result.toFixed(4)} ${toUnit}`;
        }
    }

    if (unitCategorySelect) {
        unitCategorySelect.addEventListener("change", populateUnitSelects);
    }
    if (unitFromSelect) {
        unitFromSelect.addEventListener("change", performUnitConversion);
    }
    if (unitToSelect) {
        unitToSelect.addEventListener("change", performUnitConversion);
    }
    if (unitAmountInput) {
        unitAmountInput.addEventListener("input", performUnitConversion);
    }

    if (openUnitConverterBtn) {
        openUnitConverterBtn.addEventListener("click", () => {
            dashboardModal.style.display = "none";
            unitConverterModal.style.display = "flex";
        });
    }

    if (closeUnitConverterBtn) {
        closeUnitConverterBtn.addEventListener("click", () => {
            unitConverterModal.style.display = "none";
            if (unitAmountInput) unitAmountInput.value = "";
            if (unitResultDisplay) unitResultDisplay.textContent = "0.00";
        });
    }

    populateUnitCategory();

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
            document.getElementById("edit-user-language").value = userData.language || "en";
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

    // --- Survey Modal Logic ---
    const surveyModal = document.getElementById("survey-modal");
    const closeSurveyBtn = document.getElementById("close-survey-modal");
    const surveyForm = document.getElementById("survey-form");
    const headerSurveyBtn = document.getElementById("header-survey-btn");

    if (headerSurveyBtn) {
        headerSurveyBtn.addEventListener("click", () => {
            surveyModal.style.display = "flex";
        });
    }

    if (closeSurveyBtn) {
        closeSurveyBtn.addEventListener("click", () => {
            surveyModal.style.display = "none";
            localStorage.setItem("heyNeighborSurveyShown", "true");
        });
    }

    if (surveyForm) {
        surveyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("submit-survey-btn");
            const feedback = document.getElementById("survey-feedback").value;
            const userData = JSON.parse(localStorage.getItem("heyNeighborUser") || "{}");

            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;

                // Live connection to Google Sheet
                fetch('https://script.google.com/macros/s/AKfycbxAEFqPTPCOD9efXwOSJzlObM3JPQw-8zG681Oy7OXPQaoCHSvqNVa7K_gkL3tK1RqYaw/exec', {
                    method: 'POST',
                    mode: 'no-cors', 
                    body: JSON.stringify({
                        name: userData.name || "Anonymous",
                        email: userData.email || "N/A",
                        feedback: feedback
                    })
                })
                .then(() => {
                    surveyForm.innerHTML = `
                        <div class="survey-success">
                            <i class="uil uil-check-circle survey-success-icon"></i>
                            <h4 style="color: white; margin-top: 1rem;">Thank you for your feedback!</h4>
                            <p style="color: #ccc; margin-top: 0.5rem;">Your suggestions help us build a better experience for everyone.</p>
                            <button class="btn-submit" style="margin-top: 1.5rem; width: 100%;" onclick="document.getElementById('survey-modal').style.display='none'">Close</button>
                        </div>
                    `;
                    localStorage.setItem("heyNeighborSurveyShown", "true");
                })
                .catch(err => {
                    console.error("Submission error:", err);
                    submitBtn.textContent = "Error, try again";
                    submitBtn.disabled = false;
                });
            }
        });
    }

    // Trigger survey after "first use" (3 minutes after closing onboarding)
    function triggerSurvey() {
        const onboarded = localStorage.getItem("heyNeighborOnboarded");
        const surveyShown = localStorage.getItem("heyNeighborSurveyShown");

        if (onboarded && !surveyShown) {
            // Wait 3 minutes of active browsing before showing
            setTimeout(() => {
                // Double check if they haven't seen it in the last 180s
                if (!localStorage.getItem("heyNeighborSurveyShown")) {
                    const modal = document.getElementById("survey-modal");
                    if (modal) modal.style.display = "flex";
                }
            }, 180000); // 180 seconds (3 minutes)
        }
    }

    // --- PWA "Download" Button Logic ---
    let deferredPrompt;
    const pwaInstallBtn = document.getElementById("pwa-install-btn");

    window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        if (pwaInstallBtn) {
            pwaInstallBtn.style.display = "flex";
        }
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener("click", async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                // Optionally, send analytics event with outcome of user choice
                console.log(`User response to the install prompt: ${outcome}`);
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
                // Hide our install button
                pwaInstallBtn.style.display = "none";
            }
        });
    }

    // Hide button if app is installed
    window.addEventListener("appinstalled", () => {
        if (pwaInstallBtn) pwaInstallBtn.style.display = "none";
        deferredPrompt = null;
        console.log("PWA was installed");
    });

    // Call trigger check
    triggerSurvey();

});
