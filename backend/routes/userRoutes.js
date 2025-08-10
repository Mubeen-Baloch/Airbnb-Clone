const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMe, updateProfile, getUserListings, addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/userController');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 */
router.get('/me', auth, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *       401:
 *         description: Not authenticated
 */
router.put('/me', auth, updateProfile);

/**
 * @swagger
 * /api/users/{id}/listings:
 *   get:
 *     summary: Get listings by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListingResponse'
 */
router.get('/:id/listings', getUserListings);

/**
 * @swagger
 * /api/users/wishlist/{listingId}:
 *   post:
 *     summary: Add listing to wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID to add to wishlist
 *     responses:
 *       200:
 *         description: Added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Not authenticated
 */
router.post('/wishlist/:listingId', auth, addToWishlist);

/**
 * @swagger
 * /api/users/wishlist/{listingId}:
 *   delete:
 *     summary: Remove listing from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Not authenticated
 */
router.delete('/wishlist/:listingId', auth, removeFromWishlist);

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListingResponse'
 *       401:
 *         description: Not authenticated
 */
router.get('/wishlist', auth, getWishlist);

module.exports = router; 