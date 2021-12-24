const express = require('express');
const {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers

} = require('../controllers/users');

const User = require('../middleware/auth');

const router = express.Router({
    mergeParams: true
});

const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));
router
    .route('/')
        .get(advancedResults(User), getUsers)
        .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;