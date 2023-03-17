const getHolidays = (year = (new Date()).getFullYear()) => {
    const result = {};
    CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com').getEvents(
      new Date(`${year}/04/01`), new Date(`${year + 1}/03/31`)
    ).forEach((event)=>{
      result[ Number(event.getStartTime()) ] = event.getTitle();
    });
    return result;
  };
  
  const getNextMonthAsDate = (base) => {
    const newMonth = base.getMonth() + 1;
    if(newMonth < 12) {
      return new Date(base.getFullYear(), newMonth, 1);
    } else {
      return new Date(base.getFullYear() + 1, 0, 1);
    }
  };
  
  const getMonthHead = (target) => {
    target.setDate(1);
    target.setHours(0);
    target.setMinutes(0);
    target.setSeconds(0);
    target.setMilliseconds(0);
    return target;
  };
  
  const getMonthTail = (target) => {
    return new Date(Number(getMonthHead(getNextMonthAsDate(target))) - 1);
  };
  
  const getYearLastMonth = (start) => {
    if(start.getMonth() > 3) {
      return new Date(`${start.getFullYear() + 1}/3/31`);
    } else {
      return new Date(`${start.getFullYear()}/3/31`);
    }
  };
  
  const getTargetDaysByMonth = (days, startDay, holidays) => {
    const lastDayAsNumber = Number(getMonthTail(startDay));
    let targetDayAsNumber = Number(startDay);
    const result = {
      month: startDay.getMonth() + 1,
      dayList: []
    };
    while(targetDayAsNumber < lastDayAsNumber) {
      const target = new Date(targetDayAsNumber);
      if(days.includes(target.getDay())) {
        result.dayList.push({
          date: target.getDate(),
          day: target.getDay(),
          holiday: holidays[targetDayAsNumber] || false
        });
      }
      targetDayAsNumber += (1000 * 60 * 60 * 24);
    }
    return result;
  };
  
  const confirm = () => {console.log(getTargetDays())};
  
  const getTargetDays = (days = [2, 4, 6], tmp_startDate = new Date(), tmp_endDate = getYearLastMonth(new Date())) => {
    let startDate = getMonthHead(tmp_startDate);
    const endDate = getMonthTail(tmp_endDate);
    const result = [];
    const holidays = getHolidays(startDate.getFullYear());
  
    while(Number(startDate) < Number(endDate)) {
      result.push(getTargetDaysByMonth(days, startDate, holidays));
      startDate = getNextMonthAsDate(startDate);
    }
  
    return result;
  };
  
  const doGet = () => {
    return HtmlService.createTemplateFromFile('stumpcard').evaluate();
  };
  