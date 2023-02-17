function getTimeTreeDefaultRequestOption() {
  const token = PropertiesService.getScriptProperties().getProperty('TIMETREE_TOKEN');
  return {
    'method': 'get',
    'headers': {
      'Accept': 'application/vnd.timetree.v1+json',
      'Authorization': `Bearer ${token}`
    }
  };
}

function getTimeTreeCalendarList() {
  const url = 'https://timetreeapis.com/calendars';
  const response = UrlFetchApp.fetch(url, getTimeTreeDefaultRequestOption());
  return JSON.parse(response.getContentText());
}

function getSchedulesFromTimeTreeCalendar(calendarId, days = 7) {
  const url = `https://timetreeapis.com/calendars/${calendarId}/upcoming_events?timezone=Asia/Tokyo&days=${days}`;
  const response = UrlFetchApp.fetch(url, getTimeTreeDefaultRequestOption());
  return JSON.parse(response.getContentText());
}

function getSchedulesFromTimeTreeCalendars(days = 7) {
  const calendars = getTimeTreeCalendarList().data;
  return calendars.map((calendar)=>{
    return getSchedulesFromTimeTreeCalendar(calendar.id, days).data.map((schedule)=>{
      schedule.calendarId = calendar.id;
      schedule.sortKey = Number(new Date(schedule.attributes.start_at));
      return schedule;
    })
  }).flat();
}

function getSchedulesFromGoogleCalendarsCalendars() {
  const calendarIds = PropertiesService.getScriptProperties().getProperty('GOOGLE_CALENDAR_IDs');
  if(calendarIds) {
    const start = new Date(Number(new Date()) + (1000 * 60 * 60 * 2));
    const end   = new Date(Number(new Date()) + (1000 * 60 * 60 * 2) + (1000 * 60 * 60 * 24 * 7));
    return calendarIds.split(',').map((id)=>{
      return CalendarApp.getCalendarById(id).getEvents(start, end).map((schedule)=>{
        return {
          calendarId: id,
          sortKey: Number(new Date(schedule.getStartTime())),
          isModified: true,
          isAllDay: schedule.isAllDayEvent(),
          title: schedule.getTitle(),
          date: schedule.getStartTime().toLocaleDateString('ja-JP'),
          start: schedule.getStartTime().toLocaleTimeString('ja-JP').slice(0,5),
          end: schedule.getEndTime().toLocaleTimeString('ja-JP').slice(0,5)
        };
      });
    }).flat();
  } else {
    return [];
  }
}

function getSchedules(days = 7) {
  return [
    getSchedulesFromTimeTreeCalendars(),
    getSchedulesFromGoogleCalendarsCalendars()
  ].flat().sort((a,b)=>{
    return a.sortKey - b.sortKey;
  });
}

function modifySchedulesEasyToHandle(schedules) {
  const result = [];
  let cursorDay = '';
  schedules.map((s)=>{
    if(s.isModified) {
      return s;
    }
    const attr = s.attributes;
    const start = new Date(attr.start_at);
    const end = new Date(attr.end_at);
    return {
      isAllDay: attr.all_day,
      title: attr.title,
      date: start.toLocaleDateString('ja-JP'),
      start: start.toLocaleTimeString('ja-JP').slice(0,5),
      end: end.toLocaleTimeString('ja-JP').slice(0,5)
    }
  }).forEach((s)=>{
    if(s.date !== cursorDay) {
      cursorDay = s.date;
      result.push({
        date: s.date,
        allDay: [],
        schedules: []
      });
    }
    if( s.isAllDay ) {
      result.at(-1).allDay.push(s);
    } else {
      result.at(-1).schedules.push(s);
    }
  });
  return result;
}

function generateSemiMarkdownFormattedSchedule(schedules) {
  return modifySchedulesEasyToHandle(schedules).map((daySchedule)=>{
    const result = [];
    result.push(`【${daySchedule.date}】`);
    daySchedule.allDay.forEach((schedule)=>{
      result.push(`　終日：${schedule.title}`);
    });
    daySchedule.schedules.forEach((schedule)=>{
      result.push(`　${schedule.title}`);
      result.push(`　　${schedule.start} ～ ${schedule.end}`);
    });
    return result.join('\n');
  }).join('\n\n');
}

function sendScheduleToSlack(schedules) {
  const webhook = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMING_WEBHOOK');
  const icon = PropertiesService.getScriptProperties().getProperty('SLACK_SCHEDULE_ICON') || ':カニ:';
  const payload = {
    'username': '今週のスケジュール',
    'text': generateSemiMarkdownFormattedSchedule(schedules),
    'icon_emoji': icon
  };
  const payloadString = JSON.stringify(payload);
  let les = UrlFetchApp.fetch(webhook, {
    'method': 'post',
    'contentType': 'application/json',
    'payload': payloadString,
    "muteHttpExceptions" : true,
  });

  if( les.getResponseCode() === 200 ) {
    console.log('Sent schedule to slack');
  } else {
    console.error(les.getResponseCode());
    console.error(les.getContentText());
  }
}

function sendScheduleToEmail(schedules) {
  const address = PropertiesService.getScriptProperties().getProperty('EMAIL_ADDRESS');
  GmailApp.sendEmail(address, '今週のスケジュール', generateSemiMarkdownFormattedSchedule(schedules));
}

function sendScheduleInfo(schedules) {
  if(PropertiesService.getScriptProperties().getProperty('SLACK_INCOMING_WEBHOOK')) {
    sendScheduleToSlack(schedules);
  }
  if(PropertiesService.getScriptProperties().getProperty('EMAIL_ADDRESS')) {
    sendScheduleToEmail(schedules);
  }
}

function behavior() {
  console.log(getSchedules());
}

function execute() {
  const schedules = getSchedules();
  sendScheduleInfo(schedules);
}
