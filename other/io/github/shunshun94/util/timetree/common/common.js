function getCalendarList(token) {
    const actualToken = token || PropertiesService.getScriptProperties().getProperty('TIMETREE_TOKEN');
    const url = 'https://timetreeapis.com/calendars';
    const response = UrlFetchApp.fetch(url, {
      'method': 'get',
      'headers': {
        'Accept': 'application/vnd.timetree.v1+json',
        'Authorization': `Bearer ${actualToken}`
      }
    });
    return JSON.parse(response.getContentText());
}