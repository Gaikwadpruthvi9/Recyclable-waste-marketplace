import { Router } from 'express';
import {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing
} from '../controllers/listingsController';

const router = Router();

/**
 * Listings Routes
 * Base path: /api/listings
 */

// GET /api/listings - Get all listings
router.get('/', getAllListings);

// GET /api/listings/:id - Get listing by ID
router.get('/:id', getListingById);

// POST /api/listings - Create new listing
router.post('/', createListing);

// PUT /api/listings/:id - Update listing
router.put('/:id', updateListing);

// DELETE /api/listings/:id - Delete listing
router.delete('/:id', deleteListing);

export default router;
