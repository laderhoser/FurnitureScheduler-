// Initialize Firebase
var config = {
  apiKey: "AIzaSyCdI3oEsY4Y_OnuCJytdpfO3qoaiuh0jQI",
  authDomain: "furniture-scheduler.firebaseapp.com",
  databaseURL: "https://furniture-scheduler.firebaseio.com",
  storageBucket: "",
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
var deliveriesByDate = [];

var dateCount;

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
				title: 'Test event',
				start: '2016-09-13'
			}	
		],
		eventClick: function(event) {
			swal({
				title: event.title,
				html: true,
				text: "<p>Delivery address: " + event.addy + "</p><p>Number of items: " + event.items + "</p><p>Projected time required: " + event.time + "</p><p>Special instructions: " + event.instrux + "</p><p>Entered by: " + event.salesperson + "</p>",
				allowOutsideClick: true
				//customCLass - can use to specify a CSS class for styling
			})
		},
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

		//create new object to push to calendar - so far not working
		var newDeliveryEvent = {
			title: addTitle,
			start: addStart,
			addy: addAddy,
			items: addItems,
			time: addTime,
			instrux: addInstrux,
			salesperson: addSalesperson
		}

		console.log(newDeliveryEvent);

		//creates array of event dates
		deliveriesByDate.push(addStart);

		console.log(deliveriesByDate);

		count = {};

		//counts occurrence of each date, stores in object
		deliveriesByDate.forEach(function(el) {
			count[el] = count[el] + 1 || 1;
		});

		console.log(count);

		//events.push(newDeliveryEvent);
		//$("calendar").fullCalendar("rerenderEvents");
		$("#calendar").fullCalendar("renderEvent", newDeliveryEvent, true );
	//end of add to firebase function

	});

	var APIkey = "94ccf5084d7d124f3b9a747e7d55d177";

	var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=Austin&units=imperial&appid=" + APIkey;
	//var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Austin&units=imperial&cnt=7&appid=" + APIkey;
	

	$.ajax({url: queryURL, method: 'GET'})

    // We store all of the retrieved data inside of an object called "response"
    .done(function(response) {

      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);

      // Transfer content to HTML
      $("#weatherForecast").append("<p>Temperature: " + response.main.temp + "</p>");
      $("#weatherForecast").append("<p>Humidity: " + response.main.humidity + "%</p>");
      $("#weatherForecast").append("<p>Forecast High: " + response.main.temp_max + "</p>");
      $("#weatherForecast").append("<p>Forecast Low: " + response.main.temp_min + "</p>");
    }); 


//end of document ready function		
});

function initMap() {
    var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
            center: {
                lat: 44.540,
                lng: -78.546
        },
        zoom: 8
    });
}

initMap();
