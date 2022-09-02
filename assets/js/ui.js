
let currentEvent;

async function displayUI() {    
    await signIn();

    // Display info from user profile
    const user = await getUser();
    var userName = document.getElementById('userName');
    userName.innerText = user.displayName;  
    var email = document.getElementById('email');
    email.innerText = user.mail;

    startTime();
    displayEvents();
}

async function displayEvents() {
    const events = await getEvents();
    console.log(events);
    const eventsElement = document.getElementById('events');
    const booknow = document.getElementById('booknow');
    const available = document.getElementById('avail');
    const endbooking = document.getElementById('endbooking');
    const recording = document.getElementById('recording');
    booknow.style.display = 'flex';
    endbooking.style.display = 'none';
    recording.style.display = 'none';
    available.innerHTML =  "Available | Book For Now";
    available.classList.remove('busy');
    available.classList.remove('upcoming');
    eventsElement.innerHTML = "No upcoming bookings";
    currentEvent = {};
    if (events && events.value.length >= 1) {
        console.log(events);
        eventsElement.innerHTML = "";
        events.value.forEach((event, index) => {
            if (event.showAs !== 'free') {
                
                const start = moment(event.start.dateTime + 'Z');
                const end = moment(event.end.dateTime + 'Z');
                const now = moment();
                const endStr = start.isSame(end, 'day') ? end.format("h:mma") : end.format("dddd | h:mma");
                if (start.isBefore(now) && end.isAfter(now)) {
                    available.innerHTML =  `Currently booked until ${end.format("h:mma")}<br />${event.organizer.emailAddress.name} | ${event.subject}`;
                    available.classList.add('busy');
                    booknow.style.display = 'none';
                    endbooking.style.display = 'flex';
                    currentEvent = event;
                    if (event.importance === 'high' || event.subject.search(/recording/i) >= 0) {
                        recording.style.display = 'flex';
                    } else {
                        recording.style.display = 'none';
                    }
                } else if (start.isBefore(now.add(moment.duration(15, 'minutes')))) {
                    available.innerHTML =  `Upcoming Booking at ${start.format("h:mma")}<br />${event.organizer.emailAddress.name} | ${event.subject}`;
                    available.classList.add('upcoming');
                    booknow.style.display = 'none';
                } else if (index < 3) {
                    var eventList = document.createElement('p');
                    eventList.innerHTML = `<strong>${event.organizer.emailAddress.name} | ${event.subject}</strong><br />${start.format("dddd | h:mm a")} - ${endStr} `;
                    eventsElement.appendChild(eventList);
                }
            }
        });        
    }

    setTimeout(displayEvents, 15000);
}

function startTime() {
    document.getElementById('txt').innerHTML =  moment().format("h:mma");
    setTimeout(startTime, 5000);
}

function hardLoad() {
    location.reload(true);
}

async function endNow() {
    await endEvent(currentEvent);
}

window.addEventListener('load', function () {
    displayUI();
    return false;
})