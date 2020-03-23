$(document).ready(function(){

  document.getElementById("myText").focus();

  $('.msger-chat').scrollTop($('.msger-chat')[0].scrollHeight);


  $('form').on('submit', function(){

      var item = $('form input');
      var chat = {item: item.val()};


      $.ajax({
        type: 'POST',
        url: '/answer',
        data: chat,
        success: function(data){
          
          location.reload();
          
            $('.msger-input').focus();
        
        }
      
      });

      return false;

  });


});
