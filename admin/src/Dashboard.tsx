import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import PercentIcon from '@mui/icons-material/Percent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface OrderStats {
  totals: {
    orders: number;
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
    returned: number;
    cod: number;
    prepaid: number;
    revenue: number;
  };
  recent: Array<{
    id: string;
    orderId: string;
    status: string;
    total: number;
    createdAt: string;
    customer: { firstName: string; lastName: string; phone: string };
  }>;
}

interface ProductStats {
  totals: {
    products: number;
    stockQty: number;
    outOfStock: number;
    lowStock: number;
    bestsellers: number;
    featured: number;
    active: number;
    avgRating: number;
    avgDiscountPct: number;
  };
  price: { min: number; avg: number; max: number };
  byCategory: Array<{ key: string; name: string; nameBn: string; count: number }>;
  recent: Array<{
    id: string;
    sku: string;
    title: string;
    price: number;
    image: string;
    stockQty: number;
    createdAt: string;
  }>;
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color ?? 'primary'}.main`,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export const Dashboard = () => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/products/stats', { credentials: 'same-origin' })
      .then(async (response) => {
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(json?.error?.message ?? 'Failed to load dashboard stats');
        }
        if (!cancelled) setStats(json as ProductStats);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load stats');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/orders/stats', { credentials: 'same-origin' })
      .then(async (response) => {
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(json?.error?.message ?? 'Failed to load order stats');
        }
        if (!cancelled) setOrderStats(json as OrderStats);
      })
      .catch(() => {
        // Orders endpoint may be unavailable; dashboard should still render.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalCategoryCount = useMemo(
    () => stats?.byCategory.reduce((sum, c) => sum + c.count, 0) ?? 0,
    [stats],
  );

  if (error) {
    return <Typography color="error">Failed to load dashboard: {error}</Typography>;
  }
  if (!stats) {
    return (
      <Box py={4}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<Inventory2Icon />} label="Products" value={stats.totals.products} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<LocalShippingIcon />} label="Units in stock" value={stats.totals.stockQty} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<WarningIcon />} label="Out of stock" value={stats.totals.outOfStock} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<WarningIcon />} label="Low stock" value={stats.totals.lowStock} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<StarIcon />} label="Bestsellers" value={stats.totals.bestsellers} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<StarBorderIcon />} label="Featured" value={stats.totals.featured} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<StarIcon />} label="Avg rating" value={stats.totals.avgRating.toFixed(1)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<PercentIcon />} label="Avg discount" value={`${stats.totals.avgDiscountPct.toFixed(1)}%`} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<ReceiptLongIcon />} label="Total orders" value={orderStats?.totals.orders ?? 0} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<WarningIcon />} label="Pending" value={orderStats?.totals.pending ?? 0} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<PriceCheckIcon />} label="COD orders" value={orderStats?.totals.cod ?? 0} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<PriceCheckIcon />}
            label="Revenue (BDT)"
            value={orderStats ? Math.round(orderStats.totals.revenue).toLocaleString() : '0'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Price range (BDT)" />
            <CardContent>
              <Typography variant="body1">
                Min <strong>{stats.price.min.toFixed(0)}</strong> · Avg{' '}
                <strong>{stats.price.avg.toFixed(0)}</strong> · Max{' '}
                <strong>{stats.price.max.toFixed(0)}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="Products by category"
              avatar={<CategoryIcon />}
              subheader={`${totalCategoryCount} total`}
            />
            <CardContent>
              {stats.byCategory.length === 0 ? (
                <Typography color="text.secondary">No data</Typography>
              ) : (
                <Stack spacing={1}>
                  {stats.byCategory.map((category) => {
                    const pct = totalCategoryCount > 0 ? (category.count / totalCategoryCount) * 100 : 0;
                    return (
                      <Box key={category.key}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">{category.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.count}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 2 }}>
        <CardHeader title="Recently added" avatar={<PriceCheckIcon />} />
        <CardContent>
          {stats.recent.length === 0 ? (
            <Typography color="text.secondary">No products yet</Typography>
          ) : (
            <Stack spacing={1}>
              {stats.recent.map((product) => (
                <Box key={product.id} display="flex" alignItems="center" gap={2}>
                  {product.image ? (
                    <Box
                      component="img"
                      src={product.image}
                      alt=""
                      sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : (
                    <Box width={40} height={40} />
                  )}
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sku} · {new Date(product.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {product.stockQty} in stock
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ৳{product.price.toFixed(0)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardHeader title="Recent orders" avatar={<ReceiptLongIcon />} />
        <CardContent>
          {!orderStats ? (
            <Typography color="text.secondary">No orders yet</Typography>
          ) : orderStats.recent.length === 0 ? (
            <Typography color="text.secondary">No orders yet</Typography>
          ) : (
            <Stack spacing={1}>
              {orderStats.recent.map((order) => (
                <Box key={order.id} display="flex" alignItems="center" gap={2}>
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      #{order.orderId} · {order.customer.firstName} {order.customer.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customer.phone} · {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                    {order.status}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ৳{order.total.toFixed(0)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
