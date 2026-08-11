/* =========================================================
   CLARO MOTORS — WYSZUKIWARKA OFERT (dane przykładowe)
   Pełna wyszukiwarka: Wynajem / Leasing / Kredyt, ze wspólnym
   zestawem filtrów. Działa w całości po stronie przeglądarki
   na przykładowej bazie pojazdów. Podłączenie prawdziwej bazy
   (feed dealerski / API) polega na zastąpieniu tablicy CARS
   wywołaniem do backendu — reszta logiki (render, filtry,
   sortowanie, przełączanie trybu) zostaje bez zmian.
   ========================================================= */
(function () {
    "use strict";

    var CARS = [
        { brand: "BMW", model: "320d Touring", bodyType: "Kombi", fuel: "Diesel", gearbox: "Automatyczna", drive: "Tylny", cls: "Premium", color: "Czarny", equipment: ["Skórzana tapicerka", "Kamera cofania", "Podgrzewane fotele"], promo: false, availability: "Od ręki", rates: { leasing: 2890, wynajem: 3190, kredyt: 3450 } },
        { brand: "Mercedes-Benz", model: "GLC 220d", bodyType: "SUV", fuel: "Diesel", gearbox: "Automatyczna", drive: "4x4", cls: "Premium", color: "Biały", equipment: ["Skórzana tapicerka", "Asystent pasa ruchu", "Podgrzewane fotele"], promo: true, availability: "Od ręki", rates: { leasing: 3450, wynajem: 3790, kredyt: 4020 } },
        { brand: "Audi", model: "A4 Avant 40 TDI", bodyType: "Kombi", fuel: "Diesel", gearbox: "Automatyczna", drive: "Przedni", cls: "Premium", color: "Szary", equipment: ["Kamera cofania", "Nawigacja", "Czujniki parkowania"], promo: false, availability: "30 dni", rates: { leasing: 2760, wynajem: 3020, kredyt: 3280 } },
        { brand: "Volvo", model: "XC60 B4", bodyType: "SUV", fuel: "Hybryda", gearbox: "Automatyczna", drive: "4x4", cls: "Premium", color: "Niebieski", equipment: ["Skórzana tapicerka", "Asystent pasa ruchu", "Nawigacja"], promo: true, availability: "Od ręki", rates: { leasing: 3190, wynajem: 3480, kredyt: 3720 } },
        { brand: "Volkswagen", model: "Passat 2.0 TDI", bodyType: "Sedan", fuel: "Diesel", gearbox: "Automatyczna", drive: "Przedni", cls: "Business", color: "Srebrny", equipment: ["Czujniki parkowania", "Nawigacja"], promo: false, availability: "Od ręki", rates: { leasing: 2190, wynajem: 2410, kredyt: 2600 } },
        { brand: "Skoda", model: "Superb Combi", bodyType: "Kombi", fuel: "Benzyna", gearbox: "Automatyczna", drive: "Przedni", cls: "Business", color: "Czarny", equipment: ["Kamera cofania", "Podgrzewane fotele"], promo: false, availability: "Na zamówienie", rates: { leasing: 2050, wynajem: 2260, kredyt: 2440 } },
        { brand: "Alfa Romeo", model: "Tonale Ibrida", bodyType: "SUV", fuel: "Hybryda", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Czerwony", equipment: ["Nawigacja", "Czujniki parkowania"], promo: true, availability: "30 dni", rates: { leasing: 2340, wynajem: 2560, kredyt: 2790 } },
        { brand: "Kia", model: "Sportage 1.6 T-GDI", bodyType: "SUV", fuel: "Benzyna", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Biały", equipment: ["Kamera cofania", "Czujniki parkowania"], promo: false, availability: "Od ręki", rates: { leasing: 1890, wynajem: 2080, kredyt: 2250 } },
        { brand: "Ford", model: "Kuga 2.5 PHEV", bodyType: "SUV", fuel: "Hybryda plug-in", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Szary", equipment: ["Podgrzewane fotele", "Nawigacja"], promo: false, availability: "Od ręki", rates: { leasing: 2010, wynajem: 2210, kredyt: 2390 } },
        { brand: "Hyundai", model: "Tucson 1.6 T-GDI", bodyType: "SUV", fuel: "Benzyna", gearbox: "Manualna", drive: "Przedni", cls: "Kompakt", color: "Niebieski", equipment: ["Kamera cofania"], promo: false, availability: "Od ręki", rates: { leasing: 1750, wynajem: 1930, kredyt: 2090 } },
        { brand: "Jeep", model: "Compass 4xe", bodyType: "SUV", fuel: "Hybryda plug-in", gearbox: "Automatyczna", drive: "4x4", cls: "Premium", color: "Zielony", equipment: ["Skórzana tapicerka", "Asystent pasa ruchu"], promo: true, availability: "30 dni", rates: { leasing: 2980, wynajem: 3260, kredyt: 3510 } },
        { brand: "Opel", model: "Astra Sports Tourer", bodyType: "Kombi", fuel: "Diesel", gearbox: "Manualna", drive: "Przedni", cls: "Business", color: "Czarny", equipment: ["Czujniki parkowania"], promo: false, availability: "Od ręki", rates: { leasing: 1690, wynajem: 1860, kredyt: 2010 } }
    ];

    var TYPE_LABELS = { leasing: "rata leasingu", wynajem: "rata wynajmu", kredyt: "rata kredytu" };

    var grid = document.getElementById("carGrid");
    if (!grid) return;

    var els = {
        brand: document.getElementById("f-brand"),
        body: document.getElementById("f-body"),
        fuel: document.getElementById("f-fuel"),
        gearbox: document.getElementById("f-gearbox"),
        drive: document.getElementById("f-drive"),
        cls: document.getElementById("f-class"),
        color: document.getElementById("f-color"),
        equipment: document.getElementById("f-equipment"),
        rateMin: document.getElementById("f-rate-min"),
        rateMax: document.getElementById("f-rate-max"),
        promo: document.getElementById("f-promo"),
        privateClient: document.getElementById("privateClient"),
        sort: document.getElementById("sortSelect"),
        count: document.getElementById("resultsCount"),
        heading: document.getElementById("resultsHeading")
    };

    var typeToggle = document.querySelectorAll(".type-toggle a[data-type]");
    var currentType = (function () {
        var params = new URLSearchParams(window.location.search);
        var fromUrl = params.get("typ");
        if (fromUrl === "leasing" || fromUrl === "wynajem" || fromUrl === "kredyt") return fromUrl;

        var pageDefault = window.CM_DEFAULT_TYPE;
        if (pageDefault === "leasing" || pageDefault === "wynajem" || pageDefault === "kredyt") return pageDefault;

        return "wynajem";
    })();

    function updateToggleUI() {
        typeToggle.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("data-type") === currentType);
        });
        var headings = { leasing: "Leasing samochodów", wynajem: "Wynajem długoterminowy samochodów", kredyt: "Kredyt samochodowy — wybrane oferty" };
        if (els.heading) els.heading.textContent = headings[currentType];
    }

    function populateOptions() {
        var simpleFields = { brand: "brand", body: "bodyType", fuel: "fuel", gearbox: "gearbox", drive: "drive", cls: "cls", color: "color" };
        Object.keys(simpleFields).forEach(function (key) {
            var el = els[key];
            if (!el) return;
            var values = Array.from(new Set(CARS.map(function (c) { return c[simpleFields[key]]; }))).sort();
            values.forEach(function (v) {
                var opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                el.appendChild(opt);
            });
        });

        if (els.equipment) {
            var allEquip = Array.from(new Set(CARS.reduce(function (acc, c) { return acc.concat(c.equipment); }, []))).sort();
            allEquip.forEach(function (v) {
                var opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                els.equipment.appendChild(opt);
            });
        }
    }

    function currentFilters() {
        return {
            brand: els.brand ? els.brand.value : "",
            bodyType: els.body ? els.body.value : "",
            fuel: els.fuel ? els.fuel.value : "",
            gearbox: els.gearbox ? els.gearbox.value : "",
            drive: els.drive ? els.drive.value : "",
            cls: els.cls ? els.cls.value : "",
            color: els.color ? els.color.value : "",
            equipment: els.equipment ? els.equipment.value : "",
            rateMin: els.rateMin && els.rateMin.value ? parseInt(els.rateMin.value, 10) : null,
            rateMax: els.rateMax && els.rateMax.value ? parseInt(els.rateMax.value, 10) : null,
            promo: els.promo ? els.promo.checked : false
        };
    }

    function applyFilters(cars) {
        var f = currentFilters();
        return cars.filter(function (c) {
            var rate = c.rates[currentType];
            return (!f.brand || c.brand === f.brand) &&
                (!f.bodyType || c.bodyType === f.bodyType) &&
                (!f.fuel || c.fuel === f.fuel) &&
                (!f.gearbox || c.gearbox === f.gearbox) &&
                (!f.drive || c.drive === f.drive) &&
                (!f.cls || c.cls === f.cls) &&
                (!f.color || c.color === f.color) &&
                (!f.equipment || c.equipment.indexOf(f.equipment) !== -1) &&
                (!f.promo || c.promo === true) &&
                (f.rateMin === null || rate >= f.rateMin) &&
                (f.rateMax === null || rate <= f.rateMax);
        });
    }

    function applySort(cars) {
        var sortVal = els.sort ? els.sort.value : "az";
        var sorted = cars.slice();
        if (sortVal === "az") sorted.sort(function (a, b) { return (a.brand + a.model).localeCompare(b.brand + b.model); });
        if (sortVal === "price-asc") sorted.sort(function (a, b) { return a.rates[currentType] - b.rates[currentType]; });
        if (sortVal === "price-desc") sorted.sort(function (a, b) { return b.rates[currentType] - a.rates[currentType]; });
        return sorted;
    }

    function render() {
        var cars = applySort(applyFilters(CARS));
        grid.innerHTML = "";

        if (cars.length === 0) {
            grid.innerHTML = '<div class="listing-empty">Brak pojazdów spełniających wybrane kryteria. Zmień filtry lub <a href="kontakt.html" style="color:#b87333;">zapytaj naszego doradcę</a> — dotrzemy do ofert spoza tej listy.</div>';
        } else {
            cars.forEach(function (c, i) {
                var rate = c.rates[currentType];
                var card = document.createElement("a");
                card.href = "kontakt.html";
                card.className = "car-card";
                card.style.animationDelay = (i * 55) + "ms";
                card.innerHTML =
                    '<div class="car-thumb" style="background-image:url(images/car-thumb-placeholder.jpg)">' +
                    '<span class="car-brand-badge">' + c.brand + '</span>' +
                    (c.promo ? '<span class="car-promo-badge">Promocja</span>' : '') +
                    '</div>' +
                    '<div class="car-body">' +
                    '<h3>' + c.brand + ' ' + c.model + '</h3>' +
                    '<div class="car-specs">' + c.fuel + ' · ' + c.gearbox + ' · ' + c.drive + ' · ' + c.availability + '</div>' +
                    '<div class="car-rate">od ' + rate.toLocaleString("pl-PL") + ' zł<span>' + TYPE_LABELS[currentType] + ' netto / mies., szczegóły u doradcy</span></div>' +
                    '</div>';
                grid.appendChild(card);
            });
        }

        if (els.count) {
            els.count.textContent = "Dostępnych propozycji: " + cars.length + " (baza przykładowa — pełną, bieżącą ofertę rynkową sprawdza dla Ciebie indywidualny doradca)";
        }
    }

    populateOptions();
    updateToggleUI();
    render();

    typeToggle.forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            currentType = a.getAttribute("data-type");
            var url = new URL(window.location.href);
            url.searchParams.set("typ", currentType);
            window.history.replaceState({}, "", url);
            updateToggleUI();
            render();
        });
    });

    /* Romb w filtrach wypełnia się kolorem akcentu, gdy wybrano konkretną
       wartość (nie pusty placeholder) — wizualna informacja "ten filtr jest
       aktywny". Dotyczy 8 pigułkowych selectów w .filter-grid. */
    var pillFilterKeys = ["brand", "body", "fuel", "gearbox", "drive", "cls", "color", "equipment"];
    function updateHasValueState(selectEl) {
        if (!selectEl) return;
        selectEl.classList.toggle("has-value", selectEl.value !== "");
    }
    pillFilterKeys.forEach(function (key) {
        if (els[key]) {
            updateHasValueState(els[key]);
            els[key].addEventListener("change", function () { updateHasValueState(els[key]); });
        }
    });

    ["brand", "body", "fuel", "gearbox", "drive", "cls", "color", "equipment", "rateMin", "rateMax", "sort"].forEach(function (key) {
        if (els[key]) els[key].addEventListener("change", render);
    });
    if (els.promo) els.promo.addEventListener("change", render);
})();
