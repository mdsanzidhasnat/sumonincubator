import mongoose from 'mongoose';

import { categories as mockCategories } from '../../client/src/data/categories.ts';
import { products as mockProducts } from '../../client/src/data/products.ts';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { CategoryModel } from '../src/models/category.model.js';
import { ProductModel } from '../src/models/product.model.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

export async function seed(): Promise<void> {
  await connectDb();

  const categoryMap = new Map<string, string>();
  for (const category of mockCategories) {
    const doc = await CategoryModel.findOneAndUpdate(
      { key: category.id },
      {
        $set: {
          key: category.id,
          name: category.name,
          nameBn: category.nameBn,
          iconName: category.iconName,
          itemCount: category.itemCount,
          description: category.description,
          descriptionBn: category.descriptionBn,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
    categoryMap.set(category.id, doc._id.toString());
  }
  console.log(`seeded ${categoryMap.size} categories`);

  let productCount = 0;
  for (const product of mockProducts) {
    const categoryId = categoryMap.get(product.categoryId);
    if (!categoryId) throw new Error(`missing category: ${product.categoryId}`);

    await ProductModel.findOneAndUpdate(
      { sku: product.sku },
      {
        $set: {
          sku: product.sku,
          slug: slugify(product.title),
          title: product.title,
          titleBn: product.titleBn,
          category: new mongoose.Types.ObjectId(categoryId),
          priceCents: Math.round(product.price * 100),
          originalPriceCents: Math.round(product.originalPrice * 100),
          currency: 'BDT',
          stockQty: product.inStock ? 10 : 0,
          rating: product.rating,
          reviewCount: product.reviewCount,
          images: [product.image],
          isBestseller: product.isBestseller ?? false,
          isFeatured: product.isFeatured ?? false,
          isActive: true,
          specs: product.specs ?? {},
          description: product.description,
          descriptionBn: product.descriptionBn,
        },
      },
      { upsert: true },
    );
    productCount += 1;
  }
  console.log(`seeded ${productCount} products`);
  await disconnectDb();
}
