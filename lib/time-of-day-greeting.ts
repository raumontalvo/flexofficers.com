export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good Morning,";
  }

  if (hour < 17) {
    return "Good Afternoon,";
  }

  return "Good Evening,";
}
