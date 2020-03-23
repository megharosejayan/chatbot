$(document).ready(function () {

  document.getElementById("myText").focus();

  $('.msger-chat').scrollTop($('.msger-chat')[0].scrollHeight);


  $('form').on('submit', function () {

    var item = $('form input');
    var chat = { item: item.val() };


    $.ajax({
      type: 'POST',
      url: '/answer',
      data: chat,
      success: function (data) {

        location.reload();

        $('.msger-input').focus();

      }

    });

    return false;

  });


});


function addMessage(message, time, bot = false) {

  let side = bot ? 'left' : 'right';
  let name = bot ? 'Bot' : 'You';

  let htmlString = `      <div class="msg ` + side + `-msg">
  <div class="msg-bubble">

    <div class="msg-info">
      <div class="msg-info-name">` + name + `</div>
      <div class="msg-info-time">` + time + `</div>
    </div>

    <div class="msg-text">
    ` + message + `
    </div>

  </div>
</div>`;


  let chatContainer = $('.msger-chat');

  chatContainer.append(htmlString);
  let scrollTop = $('.msger-chat')[0].scrollHeight;
  chatContainer.animate({scrollTop: scrollTop}, 'slow');
  // chatContainer.scrollTop($('.msger-chat')[0].scrollHeight);
}