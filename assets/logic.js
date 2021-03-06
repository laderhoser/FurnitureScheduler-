// Initialize Firebase
var config = {
    apiKey: "AIzaSyAeGyp-IoDF15hy31Wy-9Y_e5cCDbjkmPo",
    authDomain: "tops-delivery-scheduler.firebaseapp.com",
    databaseURL: "https://tops-delivery-scheduler.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "327987672246",
};
firebase.initializeApp(config);

var deliveryDate;
var companyName;
var deliveryAddress;
var convertedDate;
var itemNumber;
var timeRequired;
var specialInstructions;
var enteredBy;
var assemblyRequired;
//var deliveriesByDate = [];

$(document).ready(function() {

	$('#calendar').fullCalendar({
		defaultDate: '2016-09-12',
		//this will show only Monday-Friday
		weekends: false,
		//removes ability to drag and drop
		editable: false,
		eventLimit: true, // limits events shown to five a day
		events: [
			{
				title: "Example event",
				start: "2016-09-13",
				addy: "123 Main Street, Austin, TX 78701",
				items: "5",
				time: "2 hours",
				instrux: "stairs",
				assembly: "[yes/no]",
				salesperson: "Salespers"
			}	
		],
		eventClick: function(event) {
			swal({
				title: event.title,
				html: true,
				text: "<p><span class='bold'>Delivery address: </span>" + event.addy + "</p><p><span class='bold'>Number of items: </span>" + event.items + "</p><p><span class='bold'>Projected time required: </span>" + event.time + "</p><p><span class='bold'>Special instructions: </span>" + event.instrux + "</p><p><span class='bold'>Assembly required: </span>" + event.assembly + "</p><p><span class='bold'>Entered by: </span>" + event.salesperson + "</p>",
				allowOutsideClick: true,
			})
		}
	//end of full calendar function
	});

	//button for adding a new delivery
	$("#submitDelivery").on("click", function() {

		//get user inputs
		deliveryDate = $("#datepicker").val();
		convertedDate = moment(deliveryDate).format("YYYY-MM-DD");
		companyName = $("#compName").val().trim();
		deliveryAddress = $("#delAddress").val().trim();
		itemNumber = $("#itemNum").val().trim();
		timeRequired = $("#projectedHours").val().trim();
		specialInstructions = $("#specInstr").val().trim();
		assemblyRequired = $("#assemblyReq").val().trim();
		enteredBy = $("#enterBy").val().trim();


		//ceate new object to hold delivery data
		var newDeliveryListing = {
			title: companyName,
			start: convertedDate,
			addy: deliveryAddress,
			items: itemNumber,
			time: timeRequired,
			instrux: specialInstructions,
			salesperson: enteredBy
		};


		//make sure all fields have been completed, don't allow submit if not
		if (deliveryDate === "" || companyName === "" || deliveryAddress === "" || itemNumber === "" || timeRequired === "" || specialInstructions === "" || assemblyRequired === "" || enteredBy === "") {
			swal({
				title: "Incomplete Entry",
				html: true,
				text: "<p>All fields are required.</p>",
				allowOutsideClick: true
			});
			return false;
		}
		else {
		//ceate new object to hold delivery data
			var newDeliveryListing = {
				title: companyName,
				start: convertedDate,
				addy: deliveryAddress,
				items: itemNumber,
				time: timeRequired,
				instrux: specialInstructions,
				assembly: assemblyRequired,
				salesperson: enteredBy
			};
		}
		//return false;

		//upload delivery data to firebase
		firebase.database().ref().push(newDeliveryListing);

		//clear text boxes
		$("#delDate").val("");
		$("#compName").val("");
		$("#delAddress").val("");
		$("#itemNum").val("");
		$("#projectedHours").val("");
		$("#specInstr").val("");
		$("#enterBy").val("");
		$("#assemblyReq").val("");


	//end of add delivery function
	});

	//add delivery to firebase
	firebase.database().ref().on("child_added", function(childSnapshot) {

		console.log(childSnapshot.val());

		//store snapshot values in variables
		addTitle = childSnapshot.val().title;
		addStart = childSnapshot.val().start;
		addAddy = childSnapshot.val().addy;
		addItems = childSnapshot.val().items;
		addTime = childSnapshot.val().time;
		addInstrux = childSnapshot.val().instrux;
		addSalesperson = childSnapshot.val().salesperson;
		addAssembly = childSnapshot.val().assembly;

		//create new object to push to calendar
		var newDeliveryEvent = {
			title: addTitle,
			start: addStart,
			addy: addAddy,
			items: addItems,
			time: addTime,
			instrux: addInstrux,
			assembly: addAssembly,
			salesperson: addSalesperson
		}

		console.log(newDeliveryEvent);

		/*creates array of event dates - working on even limits. so far not working
		deliveriesByDate.push(addStart);

		console.log(deliveriesByDate);

		count = {};

		//counts occurrence of each date, stores in object
		deliveriesByDate.forEach(function(el) {
			count[el] = count[el] + 1 || 1;
		});

		console.log(count);*/

		$("#calendar").fullCalendar("renderEvent", newDeliveryEvent, true);

	//end of add to firebase function


	

	});

	var APIkey = "94ccf5084d7d124f3b9a747e7d55d177";

	//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=Austin+Tx&units=imperial&appid=" + APIkey;
	var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?id=4671654&units=imperial&cnt=7&appid=" + APIkey;
	

	$.ajax({url: queryURL, method: 'GET'})

    // We store all of the retrieved data inside of an object called "response"
    .done(function(response) {

      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);

      //loop through array of results to display temps and display in html

      var weatherDay = 0;
      for (w = 0; w < response.list.length; w++) {
      	$("#weatherForecast").append("<p class='weatherText bold'>" + moment(moment().add(weatherDay, "days")).format("MMMM D") + "</p>");
      	$("#weatherForecast").append("<p class='weatherText'><span class='bold'>High:</span> " + response.list[w].temp.max + "&deg;F</p>");	
      	$("#weatherForecast").append("<p class='weatherText'><span class='bold'>Low:</span> " + response.list[w].temp.min + "&deg;F</p>");
      		
      		//loop through array within array to get forecase and icon
      		for (wea = 0; wea < response.list[w].weather.length; wea++) {
      			$("#weatherForecast").append("<p class='weatherText'><span class='bold'>Forecast:</span> " + response.list[w].weather[wea].description + "</p>");
      			$("#weatherForecast").append("<img src='https://openweathermap.org/img/w/" + response.list[w].weather[wea].icon + ".png' alt='Icon depicting current weather'>");
      		}
      		weatherDay++
      //end of for loop to get weather	
      }

      // Transfer content to HTML
      /*$("#weatherForecast").append("<p class='weatherText'>Temperature: " + response.main.temp + "</p>");
      $("#weatherForecast").append("<p class='weatherText'>Humidity: " + response.main.humidity + "%</p>");
      $("#weatherForecast").append("<p class='weatherText'>Forecast High: " + response.main.temp_max + "</p>");
      $("#weatherForecast").append("<p class='weatherText'>Forecast Low: " + response.main.temp_min + "</p>");*/
    }); 


//end of document ready function		
});





function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 30.374784, lng: -97.676455}
        });
        var geocoder = new google.maps.Geocoder();

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });
      }

      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('delAddress').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
//initMap();
