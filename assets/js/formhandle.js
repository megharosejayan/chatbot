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


function addBotMessage(message, time){
  
  let htmlString = `
  <div class="msg right-msg">
    <div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"></div>

    <div class="msg-bubble">

      <div class="msg-info">
        <div class="msg-info-name">You</div>
        <div class="msg-info-time">` + time + `</div>
      </div>

      <div class="msg-text">` + message + `
      </div>

    </div>
  </div>`
}