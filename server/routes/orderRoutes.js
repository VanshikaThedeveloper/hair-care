const express = require('express');
const router = express.Router();
const {
    createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, markOrderPaid
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', markOrderPaid);
router.get('/', isAdmin, getAllOrders);
router.put('/:id', isAdmin, updateOrderStatus);

module.exports = router;
