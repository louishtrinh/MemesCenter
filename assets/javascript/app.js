/*       var api = "&api_key=mmu1qOTbmxVQOqbwiA7kzttMJ3w8b4Ci";
 */

/* Background Effect */
particlesJS(
  "particles-js",

  {
    particles: {
      number: {
        value: 200,
        density: {
          enable: false,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "star",
        stroke: {
          width: 2,
          color: "#fff5ca"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src:
            "http://wiki.lexisnexis.com/academic/images/f/fb/Itunes_podcast_icon_300.jpg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 30,
          size_min: 1,
          sync: false
        }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 12,
        direction: "left",
        random: false,
        straight: true,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  }
);

/* Firebase declare */
database = firebase.database();

memeCenter = {
  newWorld: "",
  listWorld: [""],
  contains: function(a, obj) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] == obj) {
        return true;
      }
    }
    return false;
  },
  getGif: function() {
    $("#justPulled").text($(this).attr("data-world"));
    var worldToPull = $(this).attr("data-world");
    var count = parseInt($(this).attr("data-count"));

    var api = "&api_key=dc6zaTOxFJmzC&limit";
    var queryURL =
      "https://api.giphy.com/v1/gifs/search?q=" +
      worldToPull +
      api +
      "&limit=10&offset=" +
      count;

    count = count + 10;
    $(this).attr("data-count", count);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var results = response.data;

      for (i = 0; i < results.length; i++) {
        /* Gif Card */
        var parentCard = $("<div>");
        parentCard.addClass("card w-auto text-center float-left ");

        /* Img on top of card */
        var gifImg = $("<img>");
        gifImg.addClass("card-img-top gifImage");
        gifImg.attr("data-rating", results[i].rating.toUpperCase());
        gifImg.attr("data-status", 0);
        gifImg.attr("data-active", results[i].images.fixed_height.url);
        gifImg.attr("data-still", results[i].images.fixed_height_still.url);
        gifImg.attr("src", gifImg.attr("data-still"));
        gifImg.attr("style", "width: 100%;height: 100%");

        /* Container on bottom of card */
        var cardBody = $("<div>");
        cardBody.addClass("card-body");

        /* Favorite button */
        var favBtn = $("<button>");
        favBtn.text("Add to favorite");
        favBtn.addClass("favBtn btn btn-lg btn-secondary");

        /* Rating */
        var text = $("<h3>").html(
          "Rating" +
            '<span class="badge badge-secondary">' +
            results[i].rating.toUpperCase() +
            "</span>"
        );
        /* Favorite btn and rating added to text on bottom */
        cardBody.append(favBtn);
        cardBody.append(text);

        /* Add img and text to Gif card */
        parentCard.append(gifImg);
        parentCard.append(cardBody);

        /* Add Gif card to page */
        $("#pulledGifGoesHere").prepend(parentCard);
      }
    });
  },
  addFav: function() {
    database.ref().push({
      favorite: {
        dataActive: $(this)
          .closest(".card")
          .find("img")
          .attr("data-active"),
        dataStill: $(this)
          .closest(".card")
          .find("img")
          .attr("data-still"),
        dataRating: $(this)
          .closest(".card")
          .find("img")
          .attr("data-rating")
      }
    });
  },
  playPause: function() {
    if ($(this).attr("data-status") == 0) {
      $(this).attr("src", $(this).attr("data-active"));
      $(this).attr("data-status", 1);
    } else if ($(this).attr("data-status") == 1) {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-status", 0);
    }
  },
  removeFav: function() {
    var keyToRemove = $(this).attr("data-key");
    /* Remove from Firebase */
    database.ref().child(keyToRemove).set({});
    /* Remove from page */
    $(this).closest(".card").remove();
  }
};

$("#addBtn").on("click", function(event) {
  event.preventDefault();
  memeCenter.newWorld = $("#search-input")
    .val()
    .trim();
  $("#search-input").val("");

  /* Validate data is not exist in database if not add the new data */
  if (
    memeCenter.contains(memeCenter.listWorld, memeCenter.newWorld.toUpperCase())
  ) {
    alert("Already exist in database");
  } else {
    database.ref().push({
      worlds: memeCenter.newWorld
    });
  }
});

database.ref().on("child_added", function(snapshot) {
  /* Make button to call GIF */
  if (snapshot.val().worlds) {
    memeCenter.listWorld.push(snapshot.val().worlds.toUpperCase());
    var child = $("<button>");
    child.attr("data-world", snapshot.val().worlds);
    child.attr("data-count", 1);
    child.addClass("gifBtn btn btn-outline-dark btn-lg mx-1 my-1");
    child.text(snapshot.val().worlds);
    $("#buttonGoesHere").append(child);
  } 
  else if (snapshot.val().favorite) {

    /* Favorite render */
      var data1 = snapshot.val().favorite.dataActive;
      var data2 = snapshot.val().favorite.dataStill;
      var data3 = snapshot.val().favorite.dataRating;
      var key = snapshot.key;
  
      /* Gif Card */
      var parentCard = $("<div>");
      parentCard.addClass("card w-auto text-center float-left ");
  
      /* Img on top of card */
      var gifImg = $("<img>");
      gifImg.addClass("card-img-top gifImage");
      gifImg.attr("data-rating", 0);
      gifImg.attr("data-status", 0);
      gifImg.attr("data-active", data1);
      gifImg.attr("data-still", data2);
      gifImg.attr("src", gifImg.attr("data-still"));
      gifImg.attr("style", "width: 100%;height: 100%");
  
      /* Container on bottom of card */
      var cardBody = $("<div>");
      cardBody.addClass("card-body");
  
      /* Favorite button */
      var rmvFavBtn = $("<button>");
      rmvFavBtn.text("Remove favorite");
      rmvFavBtn.addClass("rmvFavBtn btn btn-lg btn-secondary");
      rmvFavBtn.attr("data-key", key);
  
  
      /* Rating */
      var text = $("<h3>").html(
        "Rating" + '<span class="badge badge-secondary">' + data3 + "</span>"
      );
      /* Favorite btn and rating added to text on bottom */
      cardBody.append(rmvFavBtn);
      cardBody.append(text);
  
      /* Add img and text to Gif card */
      parentCard.append(gifImg);
      parentCard.append(cardBody);
  
      /* Add Gif card to page */
      $("#favGifGoesHere").prepend(parentCard);
    }
});

$(document).on("click", ".gifBtn", memeCenter.getGif);
$(document).on("click", ".gifImage", memeCenter.playPause);
$(document).on("click", "#clearBtn", function() {
  $("#pulledGifGoesHere").empty();
});
$(document).on("click", ".favBtn", memeCenter.addFav);
$(document).on("click", ".rmvFavBtn", memeCenter.removeFav);
