
$.getJSON("/articles", function(data) {
  
  for (var i = 0; i < data.length; i++) {
   // need an href for the link
  // console.log(data[i].link) ;
   var xoxo ="<p data-id='" + data[i]._id + "'>" + data[i].title+ " (click to add note) " + "<br>" + "<a href=" + data[i].link + "> click here for article </p>";
   $("#articles").append(xoxo);
  // console.log(xoxo);
   // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br>" + "<a href=" + data[i].link + "clickhere for article ></p>");
    //$('#articles').append
  }
});



$(document).on("click", "p", function() {
  
  $("#notes").empty();
 
  var thisId = $(this).attr("data-id");

 
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
   
    .done(function(data) {
      console.log(data);
    
      $("#notes").append("<h2>" + data.title + "</h2>");
     
      $("#notes").append("<input id='titleinput' name='title' >");
     
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      $("#notes").append("<button data-id'" + data._id + "' id='deletenote'>Delete Note</button>");

    
      if (data.note) {
      
        $("#titleinput").val(data.note.title);
       
        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {
  console.log("in save note");
  var thisId = $(this).attr("data-id");

 
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
    
      title: $("#titleinput").val(),
    
      body: $("#bodyinput").val()
    }
  })
   
    .done(function(data) {
      
      console.log(data);
     
      $("#notes").empty();
    });


  $("#titleinput").val("");
  $("#bodyinput").val("");
});
$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  }).done(function(data) {
    $("#notes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

