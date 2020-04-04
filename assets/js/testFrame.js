$(document).ready(function () {

    // Change this to the correct URL if you want to use this in production.
    let urlBase = "http://localhost:8000/chat/"

    let frame = $("iframe");
	$("button").click(function () {
        $("button").removeClass("selected");
        $(this).addClass("selected");
        let id = $(this).attr("id");
        let url = urlBase + id;
        console.log(url);
        frame.attr("src", url)
	});

});
