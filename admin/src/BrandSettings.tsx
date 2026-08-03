import { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Edit, SimpleForm, TextInput, useInput, useNotify } from 'react-admin';

interface UploadResponse {
  urls: string[];
  error?: { message?: string };
}

const LogoImageInput = (props: { source: string; label?: string }) => {
  const { field } = useInput(props);
  const notify = useNotify();
  const [busy, setBusy] = useState(false);
  const url: string = field.value ?? '';

  const handleFiles = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file);

    setBusy(true);
    try {
      const response = await fetch('/api/v1/uploads/products', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      const json = (await response.json().catch(() => ({}))) as UploadResponse;
      if (!response.ok) {
        throw new Error(json?.error?.message ?? 'Image upload failed');
      }
      field.onChange(json.urls[0]);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Image upload failed', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Box position="relative" display="inline-block">
        <Box
          component="img"
          src={url}
          alt=""
          sx={{
            width: 160,
            height: 160,
            objectFit: 'contain',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'block',
          }}
        />
        {url ? (
          <IconButton
            size="small"
            onClick={() => field.onChange('')}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : null}
      </Box>
      <Box mt={1}>
        <Button component="label" variant="outlined" size="small" startIcon={<CloudUploadIcon />} disabled={busy}>
          {busy ? 'Uploading…' : 'Upload logo'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
        Recommended: square logo (e.g. 500×500px) or transparent PNG.
      </Typography>
    </Box>
  );
};

export const BrandSettingsEdit = () => (
  <Edit resource="settings" id="brand" redirect={false} title="Brand / Logo Settings">
    <SimpleForm>
      <Typography variant="body2" color="text.secondary">
        Update the site logo image and brand name shown in the header and footer.
      </Typography>
      <LogoImageInput source="logoUrl" label="Logo image" />
      <TextInput source="brandName" label="Brand name" fullWidth />
    </SimpleForm>
  </Edit>
);
