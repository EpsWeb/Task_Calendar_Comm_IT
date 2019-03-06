$(function () {

    let json = [
        {start: '06:00', end: '07:00'},
        {start: '09:00', end: '12:00'},
        {start: '09:00', end: '15:30'},
        {start: '10:00', end: '14:00'},
        {start: '10:15', end: '15:30'},
        {start: '13:00', end: '14:00'},
        {start: '14:20', end: '16:30'},
        {start: '15:10', end: '16:30'},
        {start: '16:30', end: '18:00'}
    ];

    const minutesInDay = 24 * 60;

    const calendar__hours = $('#calendar__hours');
    for (let h = 0; h <= 24; h++) {
        $("<div class='calendar__hours__label'><span>" + h + ":00</span></div>").appendTo(calendar__hours);
    }

    let timeslots = [];
    for (let m = 0; m < minutesInDay; m++) {
        timeslots.push([]);
    }

    let eventsByIndex = {};
    setUpEvents(json);

    for (let e = 0; e < json.length; e++) {
        event = json[e];
        for (let m = event.startInMinutes; m < event.endInMinutes; m++) {
            timeslots[m].push(json.indexOf(event) + 1);
        }
    }

    for (let m = 0; m < minutesInDay; m++) {
        let ts = timeslots[m];
        for (let e = 0; e < ts.length; e++) {
            let event = eventsByIndex[ts[e]];
            let max = ts.length;
            ts.forEach(function (id) {
                const evt = eventsByIndex[id];
                max = (evt.numcolumns > max) ? evt.numcolumns : max;
            });

            if (event.numcolumns <= max) {
                event.numcolumns = max;
            }

            if (event.leftindex === -1) {
                let leftindex = 0;
                while (!isFreeSpace(ts, leftindex, json.indexOf(event) + 1)) {
                    leftindex++;
                }
                event.leftindex = leftindex;
            }
        }
    }

    layoutEvents();

    function isFreeSpace(ts, leftindex, eventid) {
        const tslength = ts.length;
        let event;
        for (let i = 0; i < tslength; ++i) {
            event = eventsByIndex[ts[i]];
            if (event.leftindex === leftindex) {
                return json.indexOf(event) + 1 === eventid;
            }
        }
        return true;
    }

    function setUpEvents(events) {

        for (let e = 0; e < events.length; e++) {

            let event = events[e];
            event.leftindex = -1;
            event.numcolumns = 0;
            let startHours = parseInt(event.start.substr(0, 2), 10);
            let startMinutes = parseInt(event.start.substr(3), 10) / 60;
            event.startInMinutes = (startHours + startMinutes) * 60;
            event.top = (startHours * 60) + (startMinutes * 60);

            let endHours = parseInt(event.end.substr(0, 2), 10);
            let endMinutes = parseInt(event.end.substr(3), 10) / 60;
            event.endInMinutes = (endHours + endMinutes) * 60;

            event.height = (endHours + endMinutes - startHours - startMinutes) * 60;
            let index = events.indexOf(event);
            eventsByIndex[index + 1] = event;
        }
    }

    function layoutEvents() {
        for (let e = 0; e < json.length; e++) {

            let event = json[e];
            let left = (event.leftindex / event.numcolumns * 100);

            $("<div class='calendar__data'></div>")
                .html("<h4>" + event.start + " - " + event.end + "</h4>")
                .css("top", event.top + "px")
                .css("height", event.height + "px")
                .css("width", Math.floor(100 / event.numcolumns) + '%')
                .css("left", left + '%')
                .appendTo($('#calendar__content'));
        }
    }
});