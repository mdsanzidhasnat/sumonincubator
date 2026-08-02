import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  List as MuiList,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface ImportFailure {
  row: number;
  sku: string;
  message: string;
}

interface ImportResult {
  total: number;
  created: number;
  skipped: number;
  failed: ImportFailure[];
}

export const BulkImport = () => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/v1/products/import', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(json?.error?.message ?? 'Import failed');
      }
      setResult(json as ImportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={1}>
          Bulk Import Products
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Upload a CSV or Excel file with product rows. Rows that pass validation are created in
          bulk; failures are reported per row.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button component="label" variant="contained" startIcon={<UploadFileIcon />} disabled={busy}>
            {busy ? 'Importing…' : 'Choose file'}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={(event) => void handleFile(event)}
            />
          </Button>
          <Link href="/api/v1/products/import/template" download>
            Download import template
          </Link>
        </Stack>

        {busy && (
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography variant="body2">Importing…</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box mt={2}>
            <Alert severity={result.created > 0 ? 'success' : 'info'}>
              {result.created} created, {result.skipped} skipped, {result.failed.length} failed (of{' '}
              {result.total} rows)
            </Alert>
            {result.failed.length > 0 && (
              <MuiList dense>
                {result.failed.map((failure, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Row ${failure.row}${failure.sku ? ` (${failure.sku})` : ''}`}
                      secondary={failure.message}
                    />
                  </ListItem>
                ))}
              </MuiList>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
