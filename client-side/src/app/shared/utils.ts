const TIMESTAMP = +new Date('01/01/1970 00:00:00');

export function normalizeImageName(imagePath: string): string {
  return imagePath?.split('_')?.splice(2)?.join('_');
}

export function formatSession(session: any) {
  return {
    date: formatDate(session.date),
    startTime: formatTime(session.startTime!),
    endTime: formatTime(session.endTime!),
  };
}

export function formatDate(date: any) {
  return new Date(date).toDateString();
}

export function formatTime(time: any) {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function calcTime(session: string) {
  const [h, m] = session.split(':');
  const min = +m * 60 * 1000;
  const hour = +h * 60 * 60 * 1000;
  return TIMESTAMP + hour + min;
}