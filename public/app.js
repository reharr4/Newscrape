$.getJSON("/articles", function(data){
    for(var i = 0; i<data.length; i++){
        // display appropriate information on page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" +  data[i].lead + "<br />" + data[i].byline + "</p>");
    }
});

// when someone clicks a p tag..
$(document).on("click", "p", function(){
    // empty notes from note section
    $("#notes").empty();
    // save id from p tag
    var thisId = $(this).attr("data-id");

    // make ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // add note information
    .then(function(data){
        console.log(data);
        // title of article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // input to enter new title
        $("#notes").append("<input id='titleinput' name-'title' >");
        // textarea to add new note
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // button to submit new note with article id saved to
        $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");

        // if already note in article
        if (data.note){
            // put title of note in title input
            $("#titleinput").val(data.note.title);
            // place body of note in body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

// when savenote button is clicked
$(document).on("click", "#savenote", function(){
    // grab id of article from submit button 
    var thisId = $(this).attr("data-id");

    // run POST request to change note using what's entered in inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // value from input
            title: $("#titleinput").val(),
            // value from note textarea
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        // log response
        console.log(data);
        // empty notes section
        $("#notes").empty();
    });

    //empty note input and textareas
    $("#titleinput").val("");
    $("#bodyinput").val("");
});