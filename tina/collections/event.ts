import type { Collection } from 'tinacms';
import { entityUi, localizedDocumentFields, parentRouteField } from './common';
export const EventCollection: Collection = { name: 'event', label: 'Events', path: 'src/content/events', format: 'json', ui: entityUi('academia/eventos'), fields: [
	...localizedDocumentFields, parentRouteField, { name: 'start', label: 'Start', type: 'datetime' }, { name: 'end', label: 'End', type: 'datetime' }, { name: 'location', label: 'Location', type: 'string' }, { name: 'format', label: 'Format', type: 'string' }, { name: 'registrationUrl', label: 'Registration URL', type: 'string' }, { name: 'body', label: 'Description', type: 'string', ui: { component: 'textarea' } },
] };
