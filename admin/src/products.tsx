import { useMemo } from 'react';
import {
  BooleanField,
  BooleanInput,
  Create,
  DataTable,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  List,
  maxValue,
  minValue,
  NumberField,
  NumberInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useGetList,
} from 'react-admin';

import { ThumbnailField } from './ThumbnailField';
import { ImageListInput } from './ImageListInput';
import { SpecsInput } from './SpecsInput';

interface CategoryChoice {
  id: string;
  name: string;
}

const sanitize = (values: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === '') continue;
    out[key] = value;
  }
  return out;
};

const booleanChoices = [
  { id: 'true', name: 'Yes' },
  { id: 'false', name: 'No' },
];

function useCategoryChoices(): CategoryChoice[] {
  const { data } = useGetList('categories', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'key', order: 'ASC' },
  });
  return useMemo(
    () => (data ?? []).map((c) => ({ id: String(c.key), name: String(c.name) })),
    [data],
  );
}

export const ProductList = () => {
  const categoryChoices = useCategoryChoices();

  const filters = [
    <TextInput key="q" source="q" label="Search" alwaysOn />,
    <SelectInput
      key="category"
      source="category"
      label="Category"
      choices={categoryChoices}
      resettable
    />,
    <SelectInput
      key="bestseller"
      source="bestseller"
      label="Bestseller"
      choices={booleanChoices}
      resettable
    />,
    <SelectInput
      key="featured"
      source="featured"
      label="Featured"
      choices={booleanChoices}
      resettable
    />,
  ];

  return (
    <List perPage={25} filters={filters} sort={{ field: 'createdAt', order: 'DESC' }}>
      <DataTable>
        <DataTable.Col label="" field={ThumbnailField} disableSort />
        <DataTable.Col source="sku" />
        <DataTable.Col source="title" />
        <DataTable.Col source="category" />
        <DataTable.NumberCol
          source="price"
          options={{ style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }}
        />
        <DataTable.NumberCol source="stockQty" />
        <DataTable.Col source="rating" field={NumberField} />
        <DataTable.Col source="isBestseller" field={BooleanField} />
        <DataTable.Col source="isFeatured" field={BooleanField} />
        <DataTable.Col source="inStock" field={BooleanField} />
        <DataTable.Col source="createdAt" field={DateField} />
        <DataTable.Col label="">
          <EditButton />
          <DeleteButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};

export const ProductForm = () => {
  const categoryChoices = useCategoryChoices();

  return (
    <SimpleForm>
      <TextInput source="sku" validate={[required()]} />
      <TextInput source="title" validate={[required()]} fullWidth />
      <TextInput source="titleBn" validate={[required()]} fullWidth />
      <SelectInput source="categoryKey" choices={categoryChoices} validate={[required()]} />
      <NumberInput source="priceCents" validate={[required(), minValue(0)]} />
      <NumberInput source="originalPriceCents" validate={[minValue(0)]} />
      <TextInput source="currency" defaultValue="BDT" />
      <NumberInput source="stockQty" validate={[minValue(0)]} defaultValue={0} />
      <NumberInput source="rating" validate={[minValue(0), maxValue(5)]} defaultValue={0} />
      <NumberInput source="reviewCount" validate={[minValue(0)]} defaultValue={0} />
      <BooleanInput source="isBestseller" defaultValue={false} />
      <BooleanInput source="isFeatured" defaultValue={false} />
      <ImageListInput source="images" label="Images" />
      <SpecsInput source="specs" label="Specifications" />
      <TextInput source="description" multiline fullWidth />
      <TextInput source="descriptionBn" multiline fullWidth />
    </SimpleForm>
  );
};

export const ProductCreate = () => (
  <Create transform={sanitize}>
    <ProductForm />
  </Create>
);

export const ProductEdit = () => (
  <Edit transform={sanitize}>
    <ProductForm />
  </Edit>
);
