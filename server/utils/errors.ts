import type { Response } from 'express';

export const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Request failed';

export const sendServerError = (res: Response, error: unknown) => {
    res.status(500).json({ error: getErrorMessage(error) });
};
