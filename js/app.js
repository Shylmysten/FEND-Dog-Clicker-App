let clickCounter1 = 0;

$('#img-container-1').click(function(e) {
    // 1. determine which object was clicked on
    console.log(e.target);
    // 2. get clickCounter from the correct object in the dataModule to increment
    clickCounter1++;
    // 3. update the clicker in the UI
    $('#clickCount-1')[0].innerText = clickCounter1;
});
