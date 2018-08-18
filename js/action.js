$(document).ready(function () {
    $('#searchBus').click(function () {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/searchBuses",
            data: JSON.stringify({ "fromCity": $('#from').val(), "toCity": $('#to').val(), "busTimings": $("#datepicker").val() }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                $('#schedule_departure').show();
                $('#source_dest_header').text($('#from').val() + "  ->  " + $('#to').val());
                for (var i = 0; i < data.length; i++) {
                    $("#schedule_departure tbody").append("<tr><td>"+ data[i].busId + "</td><td>" + data[i].fromCity + "</td><td>" + data[i].toCity + "</td><td>" + data[i].busTimings + "</td><td>" + data[i].costOfTravel + "</td><td><a href='javascript:openDialog(" + data[i].busId + ", " +  data[i].costOfTravel + ")' class='btn btn-warning' id='bus_" + data[i].busId + "'>Book</a></td></tr>");
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#schedule_departure_btn').click(function () {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/scheduleDeparture",
            data: JSON.stringify({ "busId": $('#bus_id').val(), "fromCity": $('#from_city').val(), "toCity": $('#to_city').val(), "busTimings": $("#datepicker_schedule").val() + " " +  $('#time_of_departure').val(), "costOfTravel": $('#travel_cost').val() }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                $("#tabs-2").append("<div class='alert alert-success'><strong>" + data.message + "</strong></div>");
            }
        });
    });
});

$(document).ready(function () {
    $('#tabs li:nth-child(3)').click(function () {
        $("#tabs-3 tbody tr").remove();

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/searchBuses",
            data: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    $("#tabs-3 tbody").append("<tr><td>"+ data[i].busId + "</td><td>" + data[i].fromCity + "</td><td>" + data[i].toCity + "</td><td>" + data[i].busTimings + "</td><td>" + data[i].costOfTravel + "</td><td><a href='javascript:openDialogForAltering(" + i + ", " + JSON.stringify({'busId': data[i].busId,  'busTimings': data[i].busTimings }) + ")' class='btn btn-warning' id='change_" + data[i].busId + "'>Edit/Delete</a></td></tr>");
                }
            }
        });
    });
});