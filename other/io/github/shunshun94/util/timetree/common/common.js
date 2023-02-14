function getDefaultRequestOption() {
  const token = PropertiesService.getScriptProperties().getProperty('TIMETREE_TOKEN');
  return {
    'method': 'get',
    'headers': {
      'Accept': 'application/vnd.timetree.v1+json',
      'Authorization': `Bearer ${token}`
    }
  };
}

function getCalendarList() {
  const url = 'https://timetreeapis.com/calendars';
  const response = UrlFetchApp.fetch(url, getDefaultRequestOption());
  return JSON.parse(response.getContentText());
}

function getSchedulesFromCalendar(calendarId, days = 7) {
  const url = `https://timetreeapis.com/calendars/${calendarId}/upcoming_events?timezone=Asia/Tokyo&days=${days}`;
  const response = UrlFetchApp.fetch(url, getDefaultRequestOption());
  return JSON.parse(response.getContentText());
}

function getSchedules(days = 7) {
  const calendars = getCalendarList().data;
  const schedules = calendars.map((calendar)=>{
    return getSchedulesFromCalendar(calendar.id, days).data.map((schedule)=>{
      schedule.calendarId = calendar.id;
      schedule.sortKey = Number(new Date(schedule.attributes.start_at));
      return schedule;
    })
  }).flat().sort((a,b)=>{
    return a.sortKey - b.sortKey;
  });
  console.log(schedules);
}
