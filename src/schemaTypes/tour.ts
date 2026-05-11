export const tourType = {
  name: 'tour',
  title: 'Tours & Events',
  type: 'document',
  fields: [
    { name: 'eventName', title: 'Event Name', type: 'string' },
    { name: 'location', title: 'City/Venue', type: 'string' },
    { name: 'date', title: 'Date', type: 'datetime' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Upcoming', 'Sold Out', 'Past'] }
    },
    { name: 'ticketLink', title: 'Ticket Link', type: 'url' }
  ]
}