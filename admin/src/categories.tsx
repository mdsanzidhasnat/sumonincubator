import { DataTable, List } from 'react-admin';

export const CategoryList = () => (
  <List perPage={25}>
    <DataTable>
      <DataTable.Col source="key" />
      <DataTable.Col source="name" />
      <DataTable.Col source="nameBn" />
      <DataTable.NumberCol source="itemCount" />
      <DataTable.Col source="iconName" />
    </DataTable>
  </List>
);
