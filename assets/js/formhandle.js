let memory = {
	related: [],
	history: []
};
let chatContainer = '';
$(document).ready(function () {
	chatContainer = $('.msger-chat');

	let i_id = initializeAndGetId();

	$('form').on('submit', function () {

		var query = $('form input').val();
		if (query === '')
			return;

		memory.related = [];
		memory.history.push(query);

		var time = getCurrentTime();
		addMessage(query, time, false);
		$('form input').val('');

		var data = { query: query, institution: i_id };

		$.ajax({
			type: 'POST',
			url: '/answer',
			data: data,
			success: function (data) {
				console.log("data: " + data);
				let ans = getAnswer(data);
				console.log("ans: " + ans);
				addMessage(ans, time, true);
				$('.msger-input').focus();
			}

		});

		return false;

	});


	$("#related").click(function () {
		console.log("Click fun")
		showPrompt(false);
		memory.related.slice(1).forEach(function (item) {
			let question = `
			<div class="msg left-msg">
				<div class="msg-bubble related-bubble">
					<div class="msg-text" >
						<p class="txt">${item.query}</p>
						<br>
						<p class="ans" style="display:none">${item.answer}</p>
					</div>
				</div>
			</div>`;

			chatContainer.append(question);
			smoothScrollDown(chatContainer);
		})

		$(".related-bubble").off("click");
		$(".related-bubble").click(function () {
			console.log("clicked")
			let element = $(this).find('.ans');
			console.log("isVisible: " + element.is(":visible"))
			if (element.is(":visible")) {
				element.hide(300);
			} else {
				element.show(300);
			}
		});
	});

});

function getCurrentTime() {
	var today = new Date();
	return (today.getHours() + ":" + today.getMinutes());
}

function initializeAndGetId() {
	document.getElementById("myText").focus();
	$("form").submit(function (e) {
		e.preventDefault();
	});
	let url = window.location.pathname;
	return url.split('/')[2];
}

function getAnswer(arr) {
	if (arr.length == 0)
		return false;

	memory.related = arr;
	console.log(arr[0][1])
	return arr[0].answer;
}



function addMessage(message, time, bot = false) {

	let side = bot ? 'left' : 'right';
	let name = bot ? 'Bot' : 'You';

	if (!message) {
		message = 'Sorry, we had some trouble understanding you.';
	}


	console.log("Message: " + message);
	if (memory.related.length > 1) {
		setTimeout(showPrompt, 1000);
	} else {
		showPrompt(false);
	}


	let htmlString = `
	<div class="msg ${side}-msg">
		<div class="msg-bubble">

			<div class="msg-info">
				<div class="msg-info-name">${name}</div>
				<div class="msg-info-time">${time}</div>
			</div>

			<div class="msg-text">
				${message}
			</div>
		</div>
	</div>`;


	chatContainer.append(htmlString);
	smoothScrollDown(chatContainer);



}

function showPrompt(show = true) {
	console.log("show: " + show);
	if (show) {
		$('#related').show(300);
		setTimeout(() => {
			$('#related').addClass("animate")
		}, 300);
		return;
	} else {
		$('#related').removeClass("animate")
		$('#related').hide(300);
		return;
	}
}

function smoothScrollDown(chatContainer) {
	let scrollTop = $('.msger-chat')[0].scrollHeight;
	chatContainer.animate({ scrollTop: scrollTop }, 'slow');
}