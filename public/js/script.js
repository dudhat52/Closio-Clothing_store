const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});
