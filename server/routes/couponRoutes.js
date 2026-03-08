const express = require('express');
const router = express.Router();
const {
    validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.post('/validate', protect, validateCoupon);
router.get('/', protect, isAdmin, getAllCoupons);
router.post('/', protect, isAdmin, createCoupon);
router.put('/:id', protect, isAdmin, updateCoupon);
router.delete('/:id', protect, isAdmin, deleteCoupon);

module.exports = router;
