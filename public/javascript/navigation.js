$(document).ready(function() {
    let toggle = $('#nav-toggle')
    toggle.click(function() {
        $('nav ul').slideToggle();
    });
    toggle.on('click', function() {
        this.classList.toggle('active');
    });
});