import type { FormattedSession, SessionObj } from "../models";

const TIMESTAMP = +new Date('01/01/1970 00:00:00');

export function normalizeImageName(imagePath: string): string {
  return imagePath?.split('_')?.splice(2)?.join('_');
}

export function formatSession(session: SessionObj): FormattedSession {
  return {
    date: formatDate(session.date),
    startTime: formatTime(session.startTime),
    endTime: formatTime(session.endTime),
  };
}

export function formatDate(date: Date | string) {
  return date instanceof Date ? date.toDateString() : new Date(date).toDateString();
}

export function formatTime(time: Date | string) {
  const date = time instanceof Date ? time : new Date(time);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function calcTime(session: string) {
  const [h, m] = session.split(':');
  const min = +m * 60 * 1000;
  const hour = +h * 60 * 60 * 1000;
  return TIMESTAMP + hour + min;
}