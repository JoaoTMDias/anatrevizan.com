import type { Collection } from 'tinacms';
import { entityUi, localizedDocumentFields, parentRouteField } from './common';
export const MentoringCollection: Collection = { name: 'mentoring', label: 'Mentoring', path: 'src/content/mentoring', format: 'json', ui: entityUi(), fields: [
	...localizedDocumentFields, parentRouteField, { name: 'audience', label: 'Audience', type: 'string' }, { name: 'format', label: 'Format', type: 'string' }, { name: 'scope', label: 'Scope', type: 'string', ui: { component: 'textarea' } }, { name: 'boundaries', label: 'Boundaries / not included', type: 'string', ui: { component: 'textarea' } }, { name: 'availability', label: 'Availability', type: 'string' },
] };
