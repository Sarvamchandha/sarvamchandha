/*=========================================================
 SARVAMCHANDHA
 Production JavaScript
 Version: 1.0
=========================================================*/

"use strict";


/*=========================================================
DOM READY
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeCurrentYear();

    initializeHeaderScroll();

    initializeScrollProgress();

    initializeMobileNavigation();

    initializeSmoothScrolling();

    initializeActiveNavigation();

    initializeRevealAnimations();

    initializeBackToTop();

    initializeFAQ();

    initializeBookingForm();

    initializePanchangaDate();

});


/*=========================================================
CURRENT YEAR
=========================================================*/

function initializeCurrentYear() {

    const currentYearElement = document.getElementById("currentYear");

    if (!currentYearElement) {
        return;
    }

    currentYearElement.textContent = new Date().getFullYear();

}


/*=========================================================
HEADER SCROLL EFFECT
=========================================================*/

function initializeHeaderScroll() {

    const header = document.getElementById("header");

    if (!header) {
        return;
    }

    const updateHeader = () => {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

}


/*=========================================================
SCROLL PROGRESS BAR
=========================================================*/

function initializeScrollProgress() {

    const progressBar = document.getElementById("progressBar");

    if (!progressBar) {
        return;
    }

    const updateProgressBar = () => {

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const documentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = `${Math.min(progress, 100)}%`;

    };

    updateProgressBar();

    window.addEventListener("scroll", updateProgressBar, {
        passive: true
    });

    window.addEventListener("resize", updateProgressBar);

}


/*=========================================================
MOBILE NAVIGATION
=========================================================*/

function initializeMobileNavigation() {

    const mobileMenuButton =
        document.getElementById("mobileMenu");

    const navigationLinks =
        document.getElementById("navLinks");

    if (!mobileMenuButton || !navigationLinks) {
        return;
    }

    const mobileMenuIcon =
        mobileMenuButton.querySelector("i");

    const closeMobileMenu = () => {

        navigationLinks.classList.remove("show");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        if (mobileMenuIcon) {

            mobileMenuIcon.classList.remove("bi-x-lg");

            mobileMenuIcon.classList.add("bi-list");

        }

    };

    const openMobileMenu = () => {

        navigationLinks.classList.add("show");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        if (mobileMenuIcon) {

            mobileMenuIcon.classList.remove("bi-list");

            mobileMenuIcon.classList.add("bi-x-lg");

        }

    };

    mobileMenuButton.addEventListener("click", () => {

        const menuIsOpen =
            navigationLinks.classList.contains("show");

        if (menuIsOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    });

    navigationLinks
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", closeMobileMenu);

        });

    document.addEventListener("click", (event) => {

        const clickedInsideMenu =
            navigationLinks.contains(event.target);

        const clickedMenuButton =
            mobileMenuButton.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {

            closeMobileMenu();

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            closeMobileMenu();

        }

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

        }

    });

}


/*=========================================================
SMOOTH SCROLLING
=========================================================*/

function initializeSmoothScrolling() {

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const targetElement =
                document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const header =
                document.getElementById("header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });

}


/*=========================================================
ACTIVE NAVIGATION LINK
=========================================================*/

function initializeActiveNavigation() {

    const sections =
        document.querySelectorAll("main section[id]");

    const navigationLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

    if (
        sections.length === 0 ||
        navigationLinks.length === 0
    ) {
        return;
    }

    const updateActiveNavigation = () => {

        const header =
            document.getElementById("header");

        const headerHeight =
            header
                ? header.offsetHeight
                : 0;

        const scrollPosition =
            window.scrollY +
            headerHeight +
            180;

        let activeSectionId = "home";

        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {

                activeSectionId = section.id;

            }

        });

        navigationLinks.forEach((link) => {

            const linkTarget =
                link.getAttribute("href");

            const isActive =
                linkTarget === `#${activeSectionId}`;

            link.classList.toggle(
                "active",
                isActive
            );

        });

    };

    updateActiveNavigation();

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateActiveNavigation
    );

}


/*=========================================================
REVEAL ANIMATIONS
=========================================================*/

function initializeRevealAnimations() {

    const animatedElements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-up"
        );

    if (animatedElements.length === 0) {
        return;
    }

    const reducedMotionEnabled =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        reducedMotionEnabled ||
        !("IntersectionObserver" in window)
    ) {

        animatedElements.forEach((element) => {

            element.classList.add("active");

            element.classList.add("show");

        });

        return;

    }

    const observer =
        new IntersectionObserver(

            (entries, animationObserver) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("active");

                    entry.target.classList.add("show");

                    animationObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }

        );

    animatedElements.forEach((element) => {

        observer.observe(element);

    });

}


/*=========================================================
BACK TO TOP
=========================================================*/

function initializeBackToTop() {

    const backToTopButton =
        document.getElementById("backToTop");

    if (!backToTopButton) {
        return;
    }

    const updateBackToTopVisibility = () => {

        if (window.scrollY > 500) {

            backToTopButton.classList.add("show");

        } else {

            backToTopButton.classList.remove("show");

        }

    };

    updateBackToTopVisibility();

    window.addEventListener(
        "scroll",
        updateBackToTopVisibility,
        {
            passive: true
        }
    );

    backToTopButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/*=========================================================
FAQ ACCORDION
=========================================================*/

function initializeFAQ() {

    const faqItems =
        document.querySelectorAll(".faq-item");

    if (faqItems.length === 0) {
        return;
    }

    faqItems.forEach((currentItem) => {

        currentItem.addEventListener(
            "toggle",
            () => {

                if (!currentItem.open) {
                    return;
                }

                faqItems.forEach((otherItem) => {

                    if (otherItem !== currentItem) {

                        otherItem.removeAttribute("open");

                    }

                });

            }
        );

    });

}


/*=========================================================
BOOKING FORM
=========================================================*/

function initializeBookingForm() {

    const bookingForm =
        document.getElementById("bookingForm");

    if (!bookingForm) {
        return;
    }

    const submitButton =
        document.getElementById("submitButton");

    const successMessage =
        document.getElementById("formSuccess");

    const errorMessage =
        document.getElementById("formError");

    const requiredFields =
        bookingForm.querySelectorAll(
            "[required]"
        );


    /*-----------------------------------------------------
    FIELD VALIDATION
    -----------------------------------------------------*/

    const validateField = (field) => {

        const formGroup =
            field.closest(".form-group");

        let isValid =
            field.checkValidity();

        if (
            field.type === "tel" &&
            field.value.trim() !== ""
        ) {

            const cleanedPhoneNumber =
                field.value.replace(
                    /[\s()+-]/g,
                    ""
                );

            isValid =
                /^[0-9]{8,15}$/.test(
                    cleanedPhoneNumber
                );

        }

        if (
            field.type === "email" &&
            field.value.trim() !== ""
        ) {

            isValid =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    field.value.trim()
                );

        }

        if (
            field.tagName === "TEXTAREA" &&
            field.hasAttribute("required")
        ) {

            isValid =
                field.value.trim().length >= 10;

        }

        if (formGroup) {

            formGroup.classList.toggle(
                "error",
                !isValid
            );

        }

        field.setAttribute(
            "aria-invalid",
            String(!isValid)
        );

        return isValid;

    };


    /*-----------------------------------------------------
    LIVE FIELD VALIDATION
    -----------------------------------------------------*/

    requiredFields.forEach((field) => {

        field.addEventListener(
            "blur",
            () => {

                validateField(field);

            }
        );

        field.addEventListener(
            "input",
            () => {

                const formGroup =
                    field.closest(".form-group");

                if (
                    formGroup &&
                    formGroup.classList.contains("error")
                ) {

                    validateField(field);

                }

            }
        );

        field.addEventListener(
            "change",
            () => {

                validateField(field);

            }
        );

    });


    /*-----------------------------------------------------
    FORM SUBMISSION
    -----------------------------------------------------*/

    bookingForm.addEventListener(
        "submit",
        (event) => {

            let formIsValid = true;

            requiredFields.forEach((field) => {

                if (!validateField(field)) {

                    formIsValid = false;

                }

            });

            if (!formIsValid) {

                event.preventDefault();

                showFormError();

                const firstInvalidField =
                    bookingForm.querySelector(
                        '[aria-invalid="true"]'
                    );

                if (firstInvalidField) {

                    firstInvalidField.focus();

                    firstInvalidField.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

                return;

            }

            hideFormMessages();

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.classList.add(
                    "btn-loading"
                );

                submitButton.setAttribute(
                    "aria-busy",
                    "true"
                );

            }

        }
    );


    /*-----------------------------------------------------
    FORM MESSAGE FUNCTIONS
    -----------------------------------------------------*/

    function showFormError() {

        if (successMessage) {

            successMessage.classList.remove("show");

        }

        if (errorMessage) {

            errorMessage.classList.add("show");

        }

    }

    function hideFormMessages() {

        if (successMessage) {

            successMessage.classList.remove("show");

        }

        if (errorMessage) {

            errorMessage.classList.remove("show");

        }

    }

}


/*=========================================================
PANCHANGA DATE
=========================================================*/

function initializePanchangaDate() {

    const dateElement =
        document.getElementById("panchangaDate");

    const weekdayElement =
        document.getElementById("panchangaWeekday");

    const varaElement =
        document.getElementById("varaValue");

    if (
        !dateElement &&
        !weekdayElement &&
        !varaElement
    ) {
        return;
    }

    const currentDate =
        new Date();

    const dateFormatter =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    const weekdayFormatter =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                weekday: "long"
            }
        );

    const formattedDate =
        dateFormatter.format(currentDate);

    const formattedWeekday =
        weekdayFormatter.format(currentDate);

    if (dateElement) {

        dateElement.textContent =
            formattedDate;

    }

    if (weekdayElement) {

        weekdayElement.textContent =
            formattedWeekday;

    }

    if (varaElement) {

        varaElement.textContent =
            getVedicWeekday(formattedWeekday);

    }

}


/*=========================================================
VEDIC WEEKDAY
=========================================================*/

function getVedicWeekday(weekday) {

    const vedicWeekdays = {

        Sunday: "Ravivara",

        Monday: "Somavara",

        Tuesday: "Mangalavara",

        Wednesday: "Budhavara",

        Thursday: "Guruvara",

        Friday: "Shukravara",

        Saturday: "Shanivara"

    };

    return vedicWeekdays[weekday] || weekday;

}