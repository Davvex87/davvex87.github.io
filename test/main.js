const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
setTimeout(function() {
    const par = document.getElementById("tx");
    const bt = document.getElementById("bt");
    par.innerHTML = "Your image should be loading...  If the image does not load try either refresh the web page or press the button below.";
    bt.style.visibility = "visible";
}, random(1000,4000));
function hehe() {
    const imag = document.getElementById("png");
    const par = document.getElementById("tx");
    const bt = document.getElementById("bt");

    par.remove();
    bt.remove();

    imag.style.visibility = "visible";
    var audio = new Audio('snd.mp3');
    audio.play();
    setTimeout(function() {
        imag.remove();
        document.body.style.background = "#ffff";
    }, 968);
}