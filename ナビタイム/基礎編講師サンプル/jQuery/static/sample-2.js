$('#switch-button').on('click', function() {
    const departure = $("#departure").val();
    const arrival = $("#arrival").val();
    $("#departure").val(arrival);
    $("#arrival").val(departure);
});
