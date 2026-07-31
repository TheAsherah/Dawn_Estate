import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { hasAuthUser } from '../types.js';
import { sendServerError } from '../utils/errors.js';
import { mapProperty } from '../utils/properties.js';

export const propertiesRouter = Router();

const toString = (value: unknown) => (typeof value === 'string' ? value : undefined);
const toNumber = (value: unknown) => {
    const text = toString(value);
    return text ? Number(text) : undefined;
};

const validCategories = ['villa', 'house', 'apartment', 'studio', 'land', 'daily-renting'] as const;
const validPrestations = ['sale', 'rent'] as const;
const validStatuses = ['pending', 'approved', 'rejected', 'disponible'] as const;

const toCategory = (value?: string) =>
    value && validCategories.includes(value as (typeof validCategories)[number]) ? value : undefined;

const toPrestation = (value?: string) =>
    value && validPrestations.includes(value as (typeof validPrestations)[number]) ? value : undefined;

const toStatus = (value?: string) =>
    value && validStatuses.includes(value as (typeof validStatuses)[number]) ? value : undefined;

const toBoolean = (value: unknown) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return false;
};

propertiesRouter.get('/', async (req, res) => {
    try {
        const rawStatus = toString(req.query.status);
        const where: Prisma.PropertyWhereInput = {};

        if (!rawStatus) {
            where.status = { in: ['approved', 'disponible'] };
        } else if (rawStatus !== 'all') {
            const status = toStatus(rawStatus);
            if (status) {
                where.status = status;
            }
        }

        const category = toCategory(toString(req.query.category));
        const prestation = toPrestation(toString(req.query.prestation));
        const city = toString(req.query.city);
        const minPrice = toNumber(req.query.minPrice);
        const maxPrice = toNumber(req.query.maxPrice);
        const hasPool = toString(req.query.pool);

        if (category) {
            where.category = { name: category };
        }

        if (prestation) {
            where.transactionType = { name: prestation };
        }

        if (city) where.city = { contains: city };
        const priceFilter: Prisma.DecimalFilter = {};
        if (minPrice !== undefined) priceFilter.gte = minPrice;
        if (maxPrice !== undefined) priceFilter.lte = maxPrice;
        if (Object.keys(priceFilter).length > 0) {
            where.price = priceFilter;
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                category: true,
                transactionType: true,
                images: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const mappedProperties = properties.map(mapProperty);
        const filteredProperties = hasPool === 'true'
            ? mappedProperties.filter((property) => property.pool)
            : mappedProperties;

        res.json({ properties: filteredProperties });
    } catch (error) {
        sendServerError(res, error);
    }
});

propertiesRouter.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                category: true,
                transactionType: true,
                images: true
            }
        });

        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json({ property: mapProperty(property) });
    } catch (error) {
        sendServerError(res, error);
    }
});

propertiesRouter.post('/', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });

        const id = uuidv4();
        const {
            category,
            prestation,
            city,
            surface,
            address,
            bedrooms,
            bathrooms,
            pool,
            price,
            images,
            title,
            description
        } = req.body;

        const categoryName = toCategory(category);
        const prestationName = toPrestation(prestation);

        if (!categoryName || !prestationName) {
            return res.status(400).json({ error: 'Invalid property category or type' });
        }

        const categoryModel = (prisma as any).category;
        const transactionTypeModel = (prisma as any).transactionType;
        const propertyImageModel = (prisma as any).propertyImage;

        let categoryRecord: { id: number } | null = null;
        let transactionTypeRecord: { id: number } | null = null;

        if (categoryModel?.findUnique) {
            categoryRecord = await categoryModel.findUnique({ where: { name: categoryName } });
        }
        if (!categoryRecord && categoryModel?.create) {
            categoryRecord = await categoryModel.create({ data: { name: categoryName } });
        }

        if (transactionTypeModel?.findUnique) {
            transactionTypeRecord = await transactionTypeModel.findUnique({ where: { name: prestationName } });
        }
        if (!transactionTypeRecord && transactionTypeModel?.create) {
            transactionTypeRecord = await transactionTypeModel.create({ data: { name: prestationName } });
        }

        const specificAttributes = {
            surface: Number(surface) || 0,
            bedrooms: Number(bedrooms) || 0,
            bathrooms: Number(bathrooms) || 0,
            pool: toBoolean(pool)
        };

        await prisma.property.create({
            data: {
                id,
                title: title || `${categoryName} in ${city || 'Marrakech'}`,
                description: description || `A ${categoryName} property in ${city || 'Marrakech'}`,
                price: Number(price) || 0,
                status: 'pending',
                categoryId: categoryRecord?.id ?? null,
                transactionTypeId: transactionTypeRecord?.id ?? null,
                address: address || city || 'Unknown address',
                city: city || 'Marrakech',
                specificAttributes: JSON.stringify(specificAttributes),
                createdBy: req.user.id
            }
        });

        if (Array.isArray(images) && images.length > 0 && propertyImageModel?.createMany) {
            await propertyImageModel.createMany({
                data: images.map((imageUrl: string, index: number) => ({
                    propertyId: id,
                    imageUrl,
                    isMain: index === 0
                }))
            });
        }

        res.json({ success: true, propertyId: id });
    } catch (error) {
        sendServerError(res, error);
    }
});

propertiesRouter.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const status = toStatus(req.body?.status);
        if (!status) return res.status(400).json({ error: 'Invalid status' });

        const id = String(req.params.id);
        await prisma.property.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ error: 'Not found' });
        }
        sendServerError(res, error);
    }
});

propertiesRouter.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        const id = String(req.params.id);
        const property = await prisma.property.findUnique({
            where: { id },
            select: { createdBy: true }
        });
        if (!property) return res.status(404).json({ error: 'Not found' });

        const user = req.user;
        const ownerId = property.createdBy ?? (property as { userId?: string }).userId;
        if (user.role !== 'admin' && ownerId !== user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.property.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        sendServerError(res, error);
    }
});
