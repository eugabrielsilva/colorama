function resize() {
    $('html').css('font-size', ((window.innerHeight / 929) * 16 * 1.1) + 'px');
}

window.onresize = resize;

resize();