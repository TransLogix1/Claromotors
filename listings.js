/* =========================================================
   CLARO MOTORS — WYSZUKIWARKA OFERT (dane przykładowe)
   Działa w całości po stronie przeglądarki — filtruje i sortuje
   listę poniżej. To dane demonstracyjne: podłączenie prawdziwej
   bazy pojazdów (feed dealerski / API) zastąpi tablię CARS
   wywołaniem do backendu, reszta logiki (render/filtry) zostaje.
   ========================================================= */
(function () {
    "use strict";

    var CARS = [
        { brand: "BMW", model: "320d Touring", bodyType: "Kombi", fuel: "Diesel", gearbox: "Automatyczna", drive: "Tylny", cls: "Premium", color: "Czarny", rate: 2890, availability: "Od ręki" },
        { brand: "Mercedes-Benz", model: "GLC 220d", bodyType: "SUV", fuel: "Diesel", gearbox: "Automatyczna", drive: "4x4", cls: "Premium", color: "Biały", rate: 3450, availability: "Od ręki" },
        { brand: "Audi", model: "A4 Avant 40 TDI", bodyType: "Kombi", fuel: "Diesel", gearbox: "Automatyczna", drive: "Przedni", cls: "Premium", color: "Szary", rate: 2760, availability: "30 dni" },
        { brand: "Volvo", model: "XC60 B4", bodyType: "SUV", fuel: "Hybryda", gearbox: "Automatyczna", drive: "4x4", cls: "Premium", color: "Niebieski", rate: 3190, availability: "Od ręki" },
        { brand: "Volkswagen", model: "Passat 2.0 TDI", bodyType: "Sedan", fuel: "Diesel", gearbox: "Automatyczna", drive: "Przedni", cls: "Business", color: "Srebrny", rate: 2190, availability: "Od ręki" },
        { brand: "Skoda", model: "Superb Combi", bodyType: "Kombi", fuel: "Benzyna", gearbox: "Automatyczna", drive: "Przedni", cls: "Business", color: "Czarny", rate: 2050, availability: "Na zamówienie" },
        { brand: "Alfa Romeo", model: "Tonale Ibrida", bodyType: "SUV", fuel: "Hybryda", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Czerwony", rate: 2340, availability: "30 dni" },
        { brand: "Kia", model: "Sportage 1.6 T-GDI", bodyType: "SUV", fuel: "Benzyna", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Biały", rate: 1890, availability: "Od ręki" },
        { brand: "Ford", model: "Kuga 2.5 PHEV", bodyType: "SUV", fuel: "Hybryda plug-in", gearbox: "Automatyczna", drive: "Przedni", cls: "Kompakt", color: "Szary", rate: 2010, availability: "Od ręki" }
    ];

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
        sort: document.getElementById("sortSelect"),
        privateClient: document.getElementById("privateClient"),
        count: document.getElementById("resultsCount")
    };

    function populateOptions() {
        var fields = { brand: "brand", body: "bodyType", fuel: "fuel", gearbox: "gearbox", drive: "drive", cls: "cls", color: "color" };
        Object.keys(fields).forEach(function (key) {
            var el = els[key];
            if (!el) return;
            var values = Array.from(new Set(CARS.map(function (c) { return c[fields[key]]; }))).sort();
            values.forEach(function (v) {
                var opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                el.appendChild(opt);
            });
        });
    }

    function currentFilters() {
        return {
            brand: els.brand ? els.brand.value : "",
            bodyType: els.body ? els.body.value : "",
            fuel: els.fuel ? els.fuel.value : "",
            gearbox: els.gearbox ? els.gearbox.value : "",
            drive: els.drive ? els.drive.value : "",
            cls: els.cls ? els.cls.value : "",
            color: els.color ? els.color.value : ""
        };
    }

    function applyFilters(cars) {
        var f = currentFilters();
        return cars.filter(function (c) {
            return (!f.brand || c.brand === f.brand) &&
                (!f.bodyType || c.bodyType === f.bodyType) &&
                (!f.fuel || c.fuel === f.fuel) &&
                (!f.gearbox || c.gearbox === f.gearbox) &&
                (!f.drive || c.drive === f.drive) &&
                (!f.cls || c.cls === f.cls) &&
                (!f.color || c.color === f.color);
        });
    }

    function applySort(cars) {
        var sortVal = els.sort ? els.sort.value : "az";
        var sorted = cars.slice();
        if (sortVal === "az") sorted.sort(function (a, b) { return (a.brand + a.model).localeCompare(b.brand + b.model); });
        if (sortVal === "price-asc") sorted.sort(function (a, b) { return a.rate - b.rate; });
        if (sortVal === "price-desc") sorted.sort(function (a, b) { return b.rate - a.rate; });
        return sorted;
    }

    function render() {
        var cars = applySort(applyFilters(CARS));
        grid.innerHTML = "";

        if (cars.length === 0) {
            grid.innerHTML = '<div class="listing-empty">Brak pojazdów spełniających wybrane kryteria. Zmień filtry lub <a href="kontakt.html" style="color:#b87333;">zapytaj naszego doradcę</a> — dotrzemy do ofert spoza tej listy.</div>';
        } else {
            cars.forEach(function (c, i) {
                var card = document.createElement("a");
                card.href = "kontakt.html";
                card.className = "car-card";
                card.style.animationDelay = (i * 60) + "ms";
                card.innerHTML =
                    '<div class="car-thumb" style="background-image:url(images/car-thumb-placeholder.jpg)">' +
                    '<span class="car-brand-badge">' + c.brand + '</span>' +
                    '</div>' +
                    '<div class="car-body">' +
                    '<h3>' + c.brand + ' ' + c.model + '</h3>' +
                    '<div class="car-specs">' + c.fuel + ' · ' + c.gearbox + ' · ' + c.drive + ' · ' + c.availability + '</div>' +
                    '<div class="car-rate">od ' + c.rate.toLocaleString("pl-PL") + ' zł<span>rata netto / mies., szczegóły u doradcy</span></div>' +
                    '</div>';
                grid.appendChild(card);
            });
        }

        if (els.count) {
            els.count.textContent = "Dostępnych propozycji: " + cars.length + " (baza przykładowa — pełna oferta rynkowa u doradcy)";
        }
    }

    populateOptions();
    render();

    ["brand", "body", "fuel", "gearbox", "drive", "cls", "color", "sort"].forEach(function (key) {
        if (els[key]) els[key].addEventListener("change", render);
    });
})();
