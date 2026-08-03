import { DataTable, DateField, List, TextInput } from 'react-admin';
import { Chip, Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';

const deviceColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  mobile: 'primary',
  tablet: 'warning',
  desktop: 'success',
};

const DeviceField = () => {
  const record = useRecordContext();
  const value = record?.deviceType as string | undefined;
  if (!value) return null;
  return <Chip size="small" label={value} color={deviceColors[value] ?? 'default'} />;
};

const PathField = () => {
  const record = useRecordContext();
  const path = record?.path as string | undefined;
  const title = record?.title as string | undefined;
  return (
    <>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {path}
      </Typography>
      {title && (
        <Typography variant="caption" color="text.secondary">
          {title.length > 60 ? `${title.slice(0, 60)}…` : title}
        </Typography>
      )}
    </>
  );
};

const SessionField = () => {
  const record = useRecordContext();
  const sessionId = record?.sessionId as string | undefined;
  const ip = record?.ip as string | undefined;
  if (!sessionId) return null;
  return (
    <>
      <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: 12 }}>
        {sessionId.slice(0, 8)}…
      </Typography>
      {ip && (
        <Typography variant="caption" color="text.secondary">
          {ip}
        </Typography>
      )}
    </>
  );
};

const BrowserField = () => {
  const record = useRecordContext();
  const value = record?.browser as string | undefined;
  if (!value) return null;
  return <Typography variant="body2">{value}</Typography>;
};

export const VisitorList = () => {
  const filters = [
    <TextInput key="path" source="path" label="Page path" alwaysOn />,
    <TextInput key="deviceType" source="deviceType" label="Device (mobile/tablet/desktop)" />,
  ];

  return (
    <List perPage={25} filters={filters} sort={{ field: 'createdAt', order: 'DESC' }}>
      <DataTable>
        <DataTable.Col source="path" label="Page" field={PathField} disableSort />
        <DataTable.Col source="deviceType" label="Device" field={DeviceField} disableSort />
        <DataTable.Col source="browser" label="Browser" field={BrowserField} disableSort />
        <DataTable.Col source="sessionId" label="Session / IP" field={SessionField} disableSort />
        <DataTable.Col source="createdAt" field={DateField} />
      </DataTable>
    </List>
  );
};
