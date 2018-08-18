$(function () {
    $("#tabs").tabs();
});
$(function () {
    $("#datepicker, #datepicker_schedule").datepicker({ dateFormat: 'yy-mm-dd' });
});
$(function () {
    $("#from, #to, #from_city, #to_city, #from_city_ed, #to_city_ed").autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.post('http://localhost:8080/api/getCities/' + request.term,
                function (data) {
                    var lstCities = []
                    for (var i = 0; i < data.length; i++) {
                        lstCities.push(data[i].cityName);
                    }
                    response(lstCities);
                });
        }
    });
});
function openDialog(bus_id, travel_cost) {
    $("#book_dialog").dialog({
        modal: true,
        width: 800,
        buttons: [
            {
                text: "Generate a Ticket",
                click: function () {
                    busObj = { "busId": bus_id, "fromCity": $('#from').val(), "toCity": $('#to').val(), "busTimings": $('#schedule_departure tbody td:nth-child(4)').text(), "costOfTravel": travel_cost }
                    custObj = { "firstName": $("#first_name").val(), "lastName": $("#last_name").val(), "phoneNumber": $("#phone_number").val(), "email": $("#email_id").val() }
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8080/api/generateTicket",
                        data: JSON.stringify(
                            {
                                bus: busObj,
                                customer: custObj
                            }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        xhrFields: {
                            responseType: 'blob'
                        },
                        success: function (data) {
                            var a = document.createElement('a');
                            var url = window.URL.createObjectURL(data);
                            a.href = url;
                            a.download = $("#last_name").val() + '_ticket.pdf';
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }
                    });
                },
                type: "submit"
            },
            {
                text: "Close",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}
function seperateDateTime(busTimings) {
    return busTimings.split(' ');
}
function removeDotZero(time) {
    return time.split('.');
}
function openDialogForAltering(index, data) {
    $('#bus_id_ed').val($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(1)').text());
    $('#from_city_ed').val($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(2)').text());
    $('#to_city_ed').val($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(3)').text());
    $('#datepicker_schedule_ed').val(seperateDateTime($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(4)').text())[0]);
    $("#time_of_departure_ed").val(removeDotZero(seperateDateTime($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(4)').text())[1])[0]);
    $('#travel_cost_ed').val($('#tabs-3 tr:nth-child(' + Number(index + 1) + ') td:nth-child(5)').text());

    $("#alter_dialog").dialog({
        modal: true,
        width: 800,
        buttons: [
            {
                text: "Edit",
                click: function () {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8080/api/editScheduleDeparture",
                        data: JSON.stringify(
                            {
                                "busObj": { "busId": $('#bus_id_ed').val(), "fromCity": $('#from_city_ed').val(), "toCity": $('#to_city_ed').val(), "busTimings": $("#datepicker_schedule_ed").val() + " " + $("#time_of_departure_ed").val(), "costOfTravel": $('#travel_cost_ed').val() },
                                "oldBusObj": { "busId": data.busId, "fromCity": "", "toCity": "", "busTimings": data.busTimings, "costOfTravel": 0 }
                            }
                        ),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        success: function (data) {
                            alert(data.message);
                            $('#tabs li:nth-child(3)').click();
                        }
                    });
                },
                type: "submit"
            },
            {
                text: "Delete",
                click: function () {
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/api/deleteScheduleDeparture/" + data.busId,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        success: function (data) {
                            alert(data.message);
                            $('#tabs li:nth-child(3)').click();
                        }
                    });
                },
                type: "submit"
            },
            {
                text: "Close",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}