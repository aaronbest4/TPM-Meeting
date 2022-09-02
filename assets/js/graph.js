// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

//Get user info from Graph
async function getUser() {
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName, mail')
        .get();
}

//Get user calendar from Graph
async function getEvents() { 
    ensureScope('Calendars.ReadWrite');
    const dateNow = new Date();
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 1);
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`;

    try {
        console.log("Fetching Events");
        const events = await graphClient     
        .api('/me/calendarView').query(query)
        .select('subject','start','end','organizer','showAs','categories','sensitivity','importance')
        .orderby(`start/DateTime`)
        .get();
        return events;
    } catch (error) {
        location.reload(true);
    }
}

//Get user calendar from Graph
async function newEvent() {
    console.log('New Event');
    ensureScope('Calendars.ReadWrite');
    const dateStart = moment();
    let dateEnd = moment();
    dateEnd = moment(dateEnd).add(30, 'm');
    const remainder = 30 - (dateEnd.minute() % 15);
    dateEnd = moment(dateEnd).add(remainder, "minutes");

    console.log(dateStart, dateStart.tz())

    const event = {
        subject: 'Ad-Hoc Booking',
        body: {
        contentType: 'HTML',
        content: 'Booked from Meeting Room Display'
        },
        start: {
            dateTime: dateStart.toDate(),
            timezone: dateStart.format('z')
        },
        end: {
            dateTime: dateEnd.toDate(),
            timezone: dateEnd.format('z')
        }
    };

    await graphClient     
    .api('/me/calendar/events')
    .post(event);

    location.reload(true);

}

//Get user calendar from Graph
async function endEvent(event) {
    console.log('End Event');
    ensureScope('Calendars.ReadWrite');
    const now = moment();
    event.end.dateTime = now.toDate();
    console.log(event);

    await graphClient     
    .api(`/me/events/${event.id}`)
    .update(event);

    location.reload(true);

}

