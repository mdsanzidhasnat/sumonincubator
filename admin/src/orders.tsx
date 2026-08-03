import { useState } from 'react';
import {
  DataTable,
  DateField,
  Edit,
  EditButton,
  List,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRecordContext,
  useRefresh,
} from 'react-admin';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  district: string;
  thana: string;
  address: string;
}

interface OrderCourier {
  status: string;
  consignmentId: string;
  trackingCode: string;
  trackingLink: string;
  invoice: string;
  error: string;
}

const statusChoices = [
  { id: 'pending', name: 'Pending' },
  { id: 'confirmed', name: 'Confirmed' },
  { id: 'delivered', name: 'Delivered' },
  { id: 'cancelled', name: 'Cancelled' },
  { id: 'returned', name: 'Returned' },
];

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  confirmed: 'primary',
  delivered: 'success',
  cancelled: 'error',
  returned: 'default',
};

const paymentMethodLabels: Record<string, string> = {
  cod: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
};

const CustomerField = () => {
  const record = useRecordContext();
  const customer = (record?.customer as OrderCustomer | undefined) ?? null;
  if (!customer) return null;
  return (
    <Stack>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {[customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {customer.phone}
      </Typography>
    </Stack>
  );
};

const PaymentMethodField = () => {
  const record = useRecordContext();
  const value = record?.paymentMethod as string | undefined;
  if (!value) return null;
  return <Typography variant="body2">{paymentMethodLabels[value] ?? value}</Typography>;
};

const StatusChipField = () => {
  const record = useRecordContext();
  const value = record?.status as string | undefined;
  if (!value) return null;
  return <Chip size="small" label={value} color={statusColors[value] ?? 'default'} />;
};

const CourierStatusField = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();
  const [busy, setBusy] = useState(false);

  const courier = (record?.courier as OrderCourier | undefined) ?? null;
  if (!courier) return null;

  const statusText: Record<string, string> = {
    pending: 'Pending',
    not_configured: 'Not configured',
    failed: 'Failed',
    created: `Tracking: ${courier.trackingCode || ''}`,
  };
  const handleRetry = async () => {
    if (!record?.id) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/orders/${record.id}/retry-courier`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      if (!res.ok) {
        throw new Error(json?.error?.message ?? 'Courier retry failed');
      }
      notify('Courier order created', { type: 'success' });
      refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Courier retry failed', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {courier.status === 'created' && courier.trackingLink ? (
        <Typography variant="body2" color="success.main">
          <a href={courier.trackingLink} target="_blank" rel="noreferrer">
            {courier.trackingCode}
          </a>
        </Typography>
      ) : (
        <Typography
          variant="body2"
          color={
            courier.status === 'created'
              ? 'success.main'
              : courier.status === 'failed'
                ? 'error.main'
                : 'text.secondary'
          }
        >
          {statusText[courier.status] ?? courier.status}
        </Typography>
      )}
      {courier.status === 'failed' && (
        <Button size="small" onClick={handleRetry} disabled={busy}>
          {busy ? '…' : 'Retry'}
        </Button>
      )}
    </Stack>
  );
};

export const OrderList = () => {
  const filters = [
    <TextInput key="q" source="q" label="Search (order #, name, phone)" alwaysOn />,
    <SelectInput
      key="status"
      source="status"
      label="Status"
      choices={statusChoices}
      resettable
    />,
  ];

  return (
    <List perPage={25} filters={filters} sort={{ field: 'createdAt', order: 'DESC' }}>
      <DataTable>
        <DataTable.Col source="orderId" label="Order #" />
        <DataTable.Col source="customer" label="Customer" field={CustomerField} disableSort />
        <DataTable.Col source="paymentMethod" label="Payment" field={PaymentMethodField} disableSort />
        <DataTable.NumberCol
          source="total"
          label="Total"
          options={{ style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }}
        />
        <DataTable.Col source="status" field={StatusChipField} disableSort />
        <DataTable.Col source="courier" label="Courier" field={CourierStatusField} disableSort />
        <DataTable.Col source="createdAt" field={DateField} />
        <DataTable.Col label="">
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};

const OrderReadOnly = () => {
  const record = useRecordContext();
  const customer = (record?.customer as OrderCustomer | undefined) ?? null;
  const courier = (record?.courier as OrderCourier | undefined) ?? null;

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
        Customer
      </Typography>
      {customer ? (
        <>
          <Typography variant="body2">
            {customer.firstName} {customer.lastName} · {customer.phone}
          </Typography>
          <Typography variant="body2">
            {customer.address}, {customer.thana}, {customer.district}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {customer.email || '—'}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      )}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2 }}>
        Courier (Steadfast)
      </Typography>
      {courier ? (
        <>
          <Typography variant="body2">Status: {courier.status}</Typography>
          {courier.consignmentId && (
            <Typography variant="body2">Consignment: {courier.consignmentId}</Typography>
          )}
          {courier.trackingCode && (
            <Typography variant="body2">Tracking: {courier.trackingCode}</Typography>
          )}
          {courier.trackingLink && (
            <Typography variant="body2">
              <a href={courier.trackingLink} target="_blank" rel="noreferrer">
                Open tracking page
              </a>
            </Typography>
          )}
          {courier.invoice && <Typography variant="body2">Invoice: {courier.invoice}</Typography>}
          {courier.error && (
            <Typography variant="body2" color="error.main">
              {courier.error}
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      )}
    </Box>
  );
};

const transform = (values: Record<string, unknown>): Record<string, unknown> => ({
  status: values.status,
});

export const OrderEdit = () => (
  <Edit transform={transform} mutationMode="pessimistic">
    <SimpleForm>
      <OrderReadOnly />
      <TextInput source="orderId" label="Order #" disabled />
      <SelectInput source="status" choices={statusChoices} validate={[required()]} />
    </SimpleForm>
  </Edit>
);
