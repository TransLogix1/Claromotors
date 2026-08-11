/* =========================================================
   CLARO MOTORS — ENHANCEMENTS SCRIPT
   Lekki, zależny wyłącznie od natywnego IntersectionObserver.
   Nie ingeruje w index.bundle.js ani opinie.bundle.js.
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* --- 1. Efekt "wejścia" logo (jednorazowy, subtelny blask) --- */
    var logoLink = document.querySelector("header nav #logo a");
    if (logoLink && !reduceMotion) {
        window.requestAnimationFrame(function () {
            logoLink.classList.add("cm-intro");
        });
        logoLink.addEventListener("animationend", function () {
            logoLink.classList.remove("cm-intro");
        });
    }

    /* --- 2. Karuzela opinii klientów (zastępuje oryginalny opinie.bundle.js) --- */
    var opinions = document.querySelectorAll(".opinions .opinion");
    if (opinions.length > 1) {
        var current = 0;
        if (!reduceMotion) {
            setInterval(function () {
                var next = (current + 1) % opinions.length;
                opinions[current].classList.remove("fade-in");
                opinions[current].classList.add("fade-out");
                opinions[next].classList.remove("fade-out");
                opinions[next].classList.add("fade-in");
                current = next;
            }, 6000);
        }
    }

    /* --- 3. Scroll reveal dla elementów .reveal --- */
    var revealEls = document.querySelectorAll(".reveal");

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
        revealEls.forEach(function (el) {
            el.classList.add("in-view");
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = el.getAttribute("data-delay");
                    if (delay) {
                        el.style.transitionDelay = delay + "ms";
                    }
                    el.classList.add("in-view");
                    observer.unobserve(el);
                }
            });
        },
        {
            root: null,
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.15
        }
    );

    revealEls.forEach(function (el) {
        observer.observe(el);
    });

    /* Zabezpieczenie awaryjne: jeśli z jakiegokolwiek powodu (stary silnik,
       przeglądarka w trybie podglądu, edge case) obserwator nie zadziała,
       po 2,5s wymuszamy pokazanie WSZYSTKICH elementów .reveal — treść
       nigdy nie zostaje trwale niewidoczna. */
    setTimeout(function () {
        document.querySelectorAll(".reveal:not(.in-view)").forEach(function (el) {
            el.classList.add("in-view");
        });
    }, 2500);
})();
