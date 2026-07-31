import type { Property, PropertyImage } from '@prisma/client';

type PropertyWithRelations = Property & {
    category?: { name: string | null } | null;
    transactionType?: { name: string | null } | null;
    images?: PropertyImage[];
    specificAttributes?: string | Record<string, unknown> | number | boolean | null;
};

export const mapProperty = (property: PropertyWithRelations) => {
    const rawAttributes = property.specificAttributes ?? '{}';
    const parsedAttributes = typeof rawAttributes === 'string'
        ? JSON.parse(rawAttributes || '{}')
        : rawAttributes;
    const attributes = (parsedAttributes ?? {}) as Record<string, unknown>;

    return {
        ...property,
        category: property.category?.name ?? 'unknown',
        prestation: property.transactionType?.name ?? 'sale',
        surface: Number(attributes.surface ?? 0),
        bedrooms: Number(attributes.bedrooms ?? 0),
        bathrooms: Number(attributes.bathrooms ?? 0),
        pool: Boolean(attributes.pool ?? false),
        images: (property.images ?? []).map((image) => image.imageUrl),
        price: Number(property.price),
        specificAttributes: attributes
    };
};
