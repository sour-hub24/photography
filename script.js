// ======================================================
// SUPABASE CONNECTION
// ======================================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://wlyugtvzgyjsaflsbvne.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_pTSQssK7uf65ltdhPtI6Ow_PBzpTuZk";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ======================================================
// MOBILE MENU
// ======================================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("open");

    });

}


// Close mobile menu after clicking a link

if (navLinks) {

    const links = navLinks.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

        });

    });

}


// ======================================================
// PORTFOLIO FILTER
// ======================================================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const photoCards =
    document.querySelectorAll(".photo-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        // Add active class to clicked button

        button.classList.add("active");


        // Get selected category

        const filter =
            button.dataset.filter;


        // Show / hide photos

        photoCards.forEach(card => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


// ======================================================
// LIGHTBOX
// ======================================================

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");

const prevImage =
    document.getElementById("prevImage");

const nextImage =
    document.getElementById("nextImage");


let currentImageIndex = 0;


// Get only visible photos

function getVisibleCards() {

    return Array.from(photoCards).filter(card => {

        return !card.classList.contains("hidden");

    });

}


// Open lightbox

function openLightbox(index) {

    const visibleCards =
        getVisibleCards();


    if (visibleCards.length === 0) {

        return;

    }


    currentImageIndex = index;


    const image =
        visibleCards[currentImageIndex]
            .querySelector("img");


    if (image) {

        lightboxImage.src = image.src;

        lightboxImage.alt = image.alt;

    }


    lightbox.classList.add("show");

}


// Add click event to photos

photoCards.forEach(card => {

    card.addEventListener("click", () => {

        const visibleCards =
            getVisibleCards();


        const index =
            visibleCards.indexOf(card);


        openLightbox(index);

    });

});


// Close lightbox

if (closeLightbox) {

    closeLightbox.addEventListener("click", () => {

        lightbox.classList.remove("show");

    });

}


// Previous image

if (prevImage) {

    prevImage.addEventListener("click", () => {

        const visibleCards =
            getVisibleCards();


        if (visibleCards.length === 0) {

            return;

        }


        currentImageIndex--;


        if (currentImageIndex < 0) {

            currentImageIndex =
                visibleCards.length - 1;

        }


        const image =
            visibleCards[currentImageIndex]
                .querySelector("img");


        if (image) {

            lightboxImage.src = image.src;

            lightboxImage.alt = image.alt;

        }

    });

}


// Next image

if (nextImage) {

    nextImage.addEventListener("click", () => {

        const visibleCards =
            getVisibleCards();


        if (visibleCards.length === 0) {

            return;

        }


        currentImageIndex++;


        if (
            currentImageIndex >=
            visibleCards.length
        ) {

            currentImageIndex = 0;

        }


        const image =
            visibleCards[currentImageIndex]
                .querySelector("img");


        if (image) {

            lightboxImage.src = image.src;

            lightboxImage.alt = image.alt;

        }

    });

}


// ======================================================
// KEYBOARD CONTROLS
// ======================================================

document.addEventListener("keydown", event => {

    if (
        !lightbox ||
        !lightbox.classList.contains("show")
    ) {

        return;

    }


    // Escape

    if (event.key === "Escape") {

        lightbox.classList.remove("show");

    }


    // Previous

    if (
        event.key === "ArrowLeft" &&
        prevImage
    ) {

        prevImage.click();

    }


    // Next

    if (
        event.key === "ArrowRight" &&
        nextImage
    ) {

        nextImage.click();

    }

});


// Close lightbox by clicking outside image

if (lightbox) {

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            lightbox.classList.remove("show");

        }

    });

}


// ======================================================
// CONTACT FORM
// ======================================================

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // Get form values

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const service =
                document
                    .getElementById("service")
                    .value;


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            // ==================================================
            // VALIDATION
            // ==================================================

            if (
                !name ||
                !email ||
                !service ||
                !message
            ) {

                formMessage.textContent =
                    "Please fill in all required fields.";

                formMessage.style.color = "red";

                return;

            }


            // Email validation

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                formMessage.textContent =
                    "Please enter a valid email address.";

                formMessage.style.color = "red";

                return;

            }


            // ==================================================
            // SUBMIT BUTTON
            // ==================================================

            const submitButton =
                contactForm.querySelector(
                    "button[type='submit']"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";

            }


            formMessage.textContent =
                "Sending your enquiry...";

            formMessage.style.color = "black";


            // ==================================================
            // SAVE DATA TO SUPABASE
            // ==================================================

            try {

                const { error } =
                    await supabase
                        .from("enquiries")
                        .insert([
                            {
                                name: name,
                                email: email,
                                phone: phone,
                                service: service,
                                message: message
                            }
                        ]);


                // ==================================================
                // ERROR
                // ==================================================

                if (error) {

                    console.error(
                        "Supabase Error:",
                        error
                    );


                    formMessage.textContent =
                        "Unable to send enquiry. Please try again.";

                    formMessage.style.color = "red";


                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Send Enquiry";

                    }


                    return;

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                formMessage.textContent =
                    "✅ Your enquiry has been sent successfully!";

                formMessage.style.color =
                    "green";


                // Clear form

                contactForm.reset();


                // Change message after few seconds

                setTimeout(() => {

                    formMessage.textContent = "";

                }, 5000);


            } catch (error) {

                console.error(
                    "Unexpected Error:",
                    error
                );


                formMessage.textContent =
                    "Something went wrong. Please try again.";

                formMessage.style.color =
                    "red";

            }


            // Enable button again

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Send Enquiry";

            }

        }
    );

}


// ======================================================
// SMOOTH SCROLL
// ======================================================

const allLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


allLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");


        if (
            targetId &&
            targetId !== "#"
        ) {

            const target =
                document.querySelector(targetId);


            if (target) {

                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }

    });

});