import { Edit, SimpleForm, TextInput } from 'react-admin';

export const ContactSettingsEdit = () => (
  <Edit resource="settings" id="contact" redirect={false} title="Contact Settings">
    <SimpleForm>
      <TextInput source="phone" label="Phone (tel:)" fullWidth />
      <TextInput source="phoneDisplay" label="Phone display text" fullWidth />
      <TextInput
        source="whatsappNumber"
        label="WhatsApp number (international, digits only, e.g. 8801712345678)"
        fullWidth
      />
      <TextInput source="whatsappDefaultMessage" label="WhatsApp default message" fullWidth />
      <TextInput source="messengerPageId" label="Messenger Page ID" fullWidth />
      <TextInput source="messengerPageUrl" label="Facebook Page URL" fullWidth />
    </SimpleForm>
  </Edit>
);
