const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendMessage, getConversation, getListingMessages, getOwnerConversations } = require('../controllers/messageController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - recipient
 *         - content
 *       properties:
 *         recipient:
 *           type: string
 *           description: Recipient user ID
 *         content:
 *           type: string
 *           description: Message content
 *         listing:
 *           type: string
 *           description: Associated listing ID (optional)
 *         sender:
 *           type: string
 *           description: Sender user ID
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient
 *               - content
 *             properties:
 *               recipient:
 *                 type: string
 *               content:
 *                 type: string
 *               listing:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 */
router.post('/', auth, sendMessage);

/**
 * @swagger
 * /api/messages/conversation/{userId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get conversation with
 *     responses:
 *       200:
 *         description: Conversation messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 */
router.get('/conversation/:userId', auth, getConversation);

/**
 * @swagger
 * /api/messages/listing/{listingId}:
 *   get:
 *     summary: Get messages for a specific listing
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID to get messages for
 *     responses:
 *       200:
 *         description: Listing messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 */
router.get('/listing/:listingId', auth, getListingMessages);

/**
 * @swagger
 * /api/messages/listing/{listingId}/owner:
 *   get:
 *     summary: Get messages for listing owner (owner only)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID to get owner messages for
 *       - in: query
 *         name: guestId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional guest ID to filter conversation to specific guest
 *     responses:
 *       200:
 *         description: Owner's messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (not the owner)
 */
router.get('/listing/:listingId/owner', auth, getOwnerConversations);

module.exports = router; 