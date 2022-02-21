export class Collection {
  constructor() {}

  collection(schema: any) {
    switch (schema) {
      case 'User':
        return 'users';
      case 'Agent':
        return 'agents';
      case 'Event':
        return 'events';
      case 'Showroom':
        return 'showrooms';
      case 'Ticket':
        return 'tickets';
      default:
        return 'users';
    }
  }
}
