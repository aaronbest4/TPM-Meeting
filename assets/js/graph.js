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
    ensureScope('Calendars.read');      
    const dateNow = new Date();
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 1);
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`;

   return await graphClient     
    .api('/me/calendarView').query(query)
    .select('subject,start,end,showAs,organizer')
    .orderby(`start/DateTime`)
    .get();
   }

