$('#add-button').on('click', (function() {
    const inputMessage = $('#input-message').val();
    const li = $('<li>').text(inputMessage);
    $('#comment-list').append(li);
}));
