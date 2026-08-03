import type { ComponentProps } from 'react';
import {
  Admin,
  CustomRoutes,
  DashboardMenuItem,
  Layout,
  Menu,
  Resource,
  useHasDashboard,
} from 'react-admin';
import { Route } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { Dashboard } from './Dashboard';
import { ProductCreate, ProductEdit, ProductList } from './products';
import { CategoryList } from './categories';
import { BulkImport } from './BulkImport';
import { ContactSettingsEdit } from './Settings';
import { HeroSettingsEdit } from './HeroSettings';
import { OrderEdit, OrderList } from './orders';
import { VisitorList } from './analytics';

const MyMenu = () => {
  const hasDashboard = useHasDashboard();
  return (
    <Menu>
      {hasDashboard ? <DashboardMenuItem /> : null}
      <Menu.ResourceItem name="products" />
      <Menu.ResourceItem name="categories" />
      <Menu.ResourceItem name="orders" />
      <Menu.ResourceItem name="analytics" />
      <Menu.Item to="/bulk-import" primaryText="Bulk Import" leftIcon={<UploadFileIcon />} />
      <Menu.Item to="/hero-settings" primaryText="Hero Banner" leftIcon={<SlideshowIcon />} />
      <Menu.Item to="/settings" primaryText="Contact Settings" leftIcon={<SettingsIcon />} />
    </Menu>
  );
};

const MyLayout = (props: ComponentProps<typeof Layout>) => (
  <Layout {...props} menu={MyMenu} />
);

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    layout={MyLayout}
    title="Sumon Incubators"
  >
    <Resource
      name="products"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
      icon={InventoryIcon}
    />
    <Resource name="categories" list={CategoryList} icon={CategoryIcon} />
    <Resource name="orders" list={OrderList} edit={OrderEdit} icon={ReceiptLongIcon} />
    <Resource name="analytics" list={VisitorList} icon={AnalyticsIcon} />
    <CustomRoutes>
      <Route path="/bulk-import" element={<BulkImport />} />
      <Route path="/hero-settings" element={<HeroSettingsEdit />} />
      <Route path="/settings" element={<ContactSettingsEdit />} />
    </CustomRoutes>
  </Admin>
);
