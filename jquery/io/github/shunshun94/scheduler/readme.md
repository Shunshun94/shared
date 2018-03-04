# io.github.shunshun94.scheduler.Scheduler

Editable shchedule table.

## Sample

[Sample](../../../../../sample/HiyokoScheduler.html)

## Usage

``` javascript

new io.github.shunshun94.scheduler.Scheduler($('#my-Scheduler'), {extendable:true});
```

## Arguments

1st argument is a HTML Element as `jQuery Object`.

2nd argument is optional parameters.

### 2nd Argument options

- extendable (Boolean)   
If it's `true`, the schedule table can be extendable.   
Default Value: `false`
- dataFormat (String)   
How the day's will be formatted. Use `%y`, `%m`, `%d` (date) and `%D` (day).   
Default Value: `%m/%d (%D)`
- initialLength (Number)   
How many days will be displayed initially.   
Default Value: `7`
- initialSchedule (Object)   
The schedules data.   
Default Value: `io.github.shunshun94.scheduler.Scheduler.INITIAL_SCHEDULE` (sample schedule)
- startDate (Date)   
The head day of the schedule table.   
Default Value: `initialSchedule` head day. If `initialSchedule` is empty, it'll Today.

## Methods

### drawSchedule

This method add a schedule.

This method gets one argument the schedule.

This method returns jQuery elements array of the added schedules.

### drawSchedules

This method add some schedules.

This method gets one argument the list of schedules.

This method returns array of jQuery elements arrays of the added schedules.

Internally, this method calls `drawSchedule`.

## Schedule structure

### io.github.shunshun94.scheduler.Scheduler.generateSchedule

Use `io.github.shunshun94.scheduler.Scheduler.generateSchedule` to generate schedule data.
This method required 3 argument and more 3 optional argument.

- id (String) - **Required**   
Unique ID of the schedule.
- label (String) - **Required**   
The schedule displayed schedule name.
- startDate (Date) - **Required**   
When the schedule is started.
- length (Number)   
The schedule length as minutes. If the schedule length is 5 hours, this value should be `300`.   
Default Value: `540`
- prepare (Number)   
Before the schedule `startDate`, Preparation time length as minutes. This value isn't included in `length`.    
Default Value: `0`
- tidyUp (Number)   
After the schedule, Tidy Up time length as minutes. This value isn't included in `length`.    
Default Value: `0`

### Schedule elements

The schedule object should have those values

- `id` …… unique id of schedule
- `label` …… displayed name of the schedule
- `start` (As Number) …… When the schedule is started
- `end` (As Number) …… When the schedule is finished
- `prepare` (As Number) …… When the schedule preparation is started. This value should be smaller value than `start`.
- `tidyUp` (As Number) …… When the schedule tidy up is finished. This value should be larger than `end`.
- `length` …… All values are length as minutes
    - `head` (As Number) …… How long the preparation
    - `body` (As Number)　…… How long the schedule
    - `foot` (As Number)　…… How long the tidy up
    - `total` (As Number) …… Sum of `head`, `body` and `foot`.

