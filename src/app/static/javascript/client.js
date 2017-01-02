$('#getUser-button').click(function() {
   $.ajax({
       type: 'POST',
       url: 'http://localhost:3000/userData'
   });
});
