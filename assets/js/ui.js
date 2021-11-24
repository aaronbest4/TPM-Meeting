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
    var events = await getEvents();    
    if (!events || events.value.length < 1) {
        eventsElement.innerHTML = "No upcoming meetings"
    } else {
        const eventsElement = document.getElementById('events');
        const available = document.getElementById('avail');
        eventsElement.innerHTML = '';
        available.innerHTML =  "Available";
        available.classList.remove('busy');
        events.value.forEach(event => {
            if (event.showAs !== 'free') {
                var eventList = document.createElement('p');
                const start = moment(event.start.dateTime + 'Z');
                const end = moment(event.end.dateTime + 'Z');
                const now = moment();
                if (start.isBefore(now) && end.isAfter(now)) {
                    available.innerHTML =  `Currently booked until ${end.format("h:mma")} by ${event.organizer.emailAddress.name}`;
                    available.classList.add('busy');
                }
                const endStr = start.isSame(end, 'day') ? end.format("h:mma") : end.format("dddd | h:mma");
                eventList.innerHTML = `<strong>${event.subject}</strong><br />${start.format("dddd | h:mm a")} - ${endStr} `;
                eventsElement.appendChild(eventList);
            }
        });        
    }

    setTimeout(displayEvents, 60000);
}

function startTime() {
    document.getElementById('txt').innerHTML =  moment().format("h:mma");
    setTimeout(startTime, 1000);
}

window.addEventListener('load', function () {
    displayUI();
    return false;
})