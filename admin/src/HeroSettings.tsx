import { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  ArrayInput,
  Edit,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useInput,
  useNotify,
} from 'react-admin';

interface UploadResponse {
  urls: string[];
  error?: { message?: string };
}

const RECOMMENDED_WIDTH = 1920;
const RECOMMENDED_HEIGHT = 640;

const HeroImageInput = (props: { source: string; label?: string }) => {
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
            width: 320,
            height: 107,
            objectFit: 'cover',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
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
          {busy ? 'Uploading…' : 'Upload image'}
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
        Recommended: {RECOMMENDED_WIDTH}×{RECOMMENDED_HEIGHT}px (3:1 banner)
      </Typography>
    </Box>
  );
};

export const HeroSettingsEdit = () => (
  <Edit resource="settings" id="hero" redirect={false} title="Hero Banner Settings">
    <SimpleForm>
      <Typography variant="body2" color="text.secondary">
        Customize the homepage hero carousel slides. Upload banner images at {RECOMMENDED_WIDTH}×
        {RECOMMENDED_HEIGHT}px (3:1) for the best fit.
      </Typography>
      <ArrayInput source="slides" label="Slides">
        <SimpleFormIterator>
          <HeroImageInput source="image" label="Banner image" />
          <TextInput source="titleEn" label="Title (English)" fullWidth />
          <TextInput source="titleBn" label="Title (Bangla)" fullWidth />
          <TextInput source="badgeEn" label="Badge (English)" fullWidth />
          <TextInput source="badgeBn" label="Badge (Bangla)" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
