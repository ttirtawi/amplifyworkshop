export function dateFormat(input) {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const temp = new Date(input);

  const displayDate = temp.toLocaleDateString('en-US', options);
  return displayDate;
}
