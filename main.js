// Shrink Navbar on Scroll
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    nav.classList.toggle("shrink", window.scrollY > 60);
});


// Active Link Highlight
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section, header");
    const links = document.querySelectorAll(".navbar a");
    const navHeight = document.querySelector(".navbar").offsetHeight;

    let currentSection = "";

    const scrollPos = window.scrollY + navHeight + 50; 

    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            currentSection = sec.id;
        }
    });

    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});
