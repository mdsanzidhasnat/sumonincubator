import { useState } from 'react';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useInput } from 'react-admin';

interface SpecRow {
  key: string;
  value: string;
}

export const SpecsInput = (props: { source: string; label?: string }) => {
  const { field } = useInput(props);
  const raw: Record<string, string> =
    field.value && typeof field.value === 'object' && !Array.isArray(field.value)
      ? (field.value as Record<string, string>)
      : {};

  const [drafts, setDrafts] = useState<SpecRow[]>(() => {
    const entries = Object.entries(raw);
    return entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }];
  });

  const commit = (next: SpecRow[]) => {
    setDrafts(next);
    const result: Record<string, string> = {};
    next.forEach(({ key, value }) => {
      if (key.trim()) result[key.trim()] = value;
    });
    field.onChange(result);
  };

  const update = (index: number, patch: Partial<SpecRow>) => {
    commit(drafts.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const add = () => commit([...drafts, { key: '', value: '' }]);

  const remove = (index: number) => commit(drafts.filter((_, i) => i !== index));

  return (
    <Box>
      <Stack spacing={1} mb={1}>
        {drafts.map((row, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <TextField
              label="Key"
              value={row.key}
              size="small"
              onChange={(event) => update(index, { key: event.target.value })}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Value"
              value={row.value}
              size="small"
              onChange={(event) => update(index, { value: event.target.value })}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={() => remove(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" onClick={add}>
        Add specification
      </Button>
    </Box>
  );
};
