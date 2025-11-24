import { EntityDefinition } from '@/core/types/entity';

export const tournament: EntityDefinition = {
  fields: {
    name: {
      type: 'string',
      label: 'Tournament Name',
      validation: { required: true, minLength: 3, maxLength: 255 }
    },
    game: {
      type: 'string',
      label: 'Game Title',
      validation: { required: true, maxLength: 100 }
    },
    startDate: {
      type: 'date',
      label: 'Start Date',
      validation: { required: true }
    },
    status: {
      type: 'enum',
      label: 'Status',
      options: ['upcoming', 'live', 'completed', 'cancelled'],
      defaultValue: 'upcoming',
      validation: { required: true }
    },
    prizePool: {
      type: 'number',
      label: 'Prize Pool ($)',
      validation: { min: 0 }
    }
  },
  display: {
    singular: 'Tournament',
    plural: 'Tournaments',
    icon: 'trophy',
    listColumns: ['name', 'game', 'startDate', 'status', 'prizePool'],
    sortBy: 'startDate',
    sortOrder: 'asc'
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  permissions: {
    read: ['guest', 'user', 'staff', 'admin'],
    write: ['staff', 'admin'],
    delete: ['admin']
  },
  collectionId: 'tournaments',
  databaseId: 'cursed_arena'
};
