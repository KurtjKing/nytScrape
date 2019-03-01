

$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<button data-id='" + data[i]._id + "' class='deletebtn'>X</button><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "#scrape", function () {
  console.log("clicked");
  location.href = "/scrape";
});


// When you click the savenote button
$(document).on("click", "#savenote", function () {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");


  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Handle Delete Article button
$(".removeSaved").on("click", function () {
  var thisId = $(this).attr("data-id");
  console.log(thisId, "this is id");
  console.log("clicked");
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId
  }).done(function (data) {
    window.location = "/saved"
  })
});



// When you click the savenote button
$(document).on("click", ".deletebtn", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done
    .then(function (data) {
      location.reload();
    });



  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
