import type { Collection } from 'tinacms';
import { entityUi, localizedDocumentFields, parentRouteField } from './common';
export const TrainingCollection: Collection = { name: 'training', label: 'Training', path: 'src/content/training', format: 'json', ui: entityUi('academia/formacoes'), fields: [
	...localizedDocumentFields, parentRouteField, { name: 'audience', label: 'Audience', type: 'string' }, { name: 'duration', label: 'Duration', type: 'string' }, { name: 'format', label: 'Format', type: 'string' }, { name: 'programme', label: 'Programme', type: 'string', ui: { component: 'textarea' } }, { name: 'availability', label: 'Availability', type: 'string' },
] };
