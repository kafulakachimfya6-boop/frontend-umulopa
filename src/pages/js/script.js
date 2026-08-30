
document.addEventListener("DOMContentLoaded", function () {

    function updateClock() {

        const clock = document.getElementById("clock");

        if (!clock) return;

        const now = new Date();

        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };

        const date = now.toLocaleDateString(undefined, options);
        const time = now.toLocaleTimeString();

        clock.innerHTML = `${date} | ${time}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    /*==============================
        ANIMATED COUNTERS
    ==============================*/

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const updateCounter = () => {

            const target = +counter.getAttribute("data-target");
            const current = +counter.innerText;

            const increment = Math.ceil(target / 100);

            if (current < target) {

                counter.innerText = current + increment;

                setTimeout(updateCounter, 20);

            } else {

                counter.innerText = target;

            }

        };

        updateCounter();

    });

    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.transition = "1.5s";
            bar.style.width = width;

        }, 300);

    });

    const bloodCards = document.querySelectorAll(".blood-card");

    bloodCards.forEach(card => {

        card.addEventListener("mouseenter", function () {

            this.style.transform = "scale(1.05)";
            this.style.transition = ".3s";

        });

        card.addEventListener("mouseleave", function () {

            this.style.transform = "scale(1)";

        });

    });

    /*==============================
        WIDGET HOVER EFFECT
    ==============================*/

    const widgets = document.querySelectorAll(".widget");

    widgets.forEach(widget => {

        widget.addEventListener("mouseenter", () => {

            widget.style.boxShadow =
                "0 15px 30px rgba(0,0,0,0.15)";

        });

        widget.addEventListener("mouseleave", () => {

            widget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.1)";

        });

    });


    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        row.addEventListener("click", () => {

            rows.forEach(r => r.style.background = "");

            row.style.background = "#ffe5e5";

        });

    });

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "1s";
        document.body.style.opacity = "1";

    }, 100);


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

    /*== RANDOM ALERTS ==*/

    const alerts = [

        "🩸 New blood donation received.",
        "⚠ O- Blood stock is low.",
        "✅ Blood request approved.",
        "🚑 Emergency request received.",
        "❤️ Thank you to all active donors!"

    ];

    function randomAlert() {

        const message =
            alerts[Math.floor(Math.random() * alerts.length)];

        console.log(message);

    }

    setInterval(randomAlert, 30000);

    let seconds = 0;

    setInterval(() => {

        seconds++;

        if (seconds === 300) {

            console.log("Dashboard data refreshed.");

            seconds = 0;

        }

    }, 1000);

});