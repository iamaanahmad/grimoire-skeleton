import { generateTypes } from '../src/core/generators/type-generator';
import { EntityDefinition } from '../src/core/types/entity';

const testEntity: EntityDefinition = {
    collectionId: 'test-users',
    databaseId: 'test-db',
    fields: {
        name: { type: 'string', required: true, label: 'Name' },
        age: { type: 'number', label: 'Age' },
        isActive: { type: 'boolean', label: 'Active' },
        role: { type: 'enum', options: ['admin', 'user'], label: 'Role', required: true },
        managerId: { type: 'reference', reference: 'user', label: 'Manager' },
        joinedAt: { type: 'date', label: 'Joined Date' }
    },
    permissions: {
        read: ['admin', 'user', 'staff'],
        write: ['admin'],
        delete: ['admin']
    },
    features: ['list', 'create', 'edit', 'detail'],
    display: {
        icon: 'user',
        singular: 'Test User',
        plural: 'Test Users',
        listColumns: ['name', 'role', 'isActive']
    }
};

async function run() {
    try {
        console.log('Generating types for TestUser...');
        const code = await generateTypes('testUser', testEntity);
        console.log('--- Generated Code ---');
        console.log(code);
        console.log('----------------------');
        console.log('Test passed!');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

run();
