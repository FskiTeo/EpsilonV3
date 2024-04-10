const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');


// Auth Uniquement
router.post('/register', AuthController.signUp);
router.get("/validate/:userId/:token", AuthController.validateAccount);
router.post("/login", AuthController.signIn);
router.get("/logout", requireAuth, AuthController.signOut);

// User
router.get('/', requireAuth, UserController.getAllUsers);
router.get('/me', requireAuth, UserController.getMe);
router.get('/:id', requireAuth, UserController.getUserInfos);
router.put('/me', requireAuth, UserController.updateMe);
router.put('/:id', requireAdmin, UserController.updateUserInfos);
router.delete("/me", requireAuth, UserController.deleteMe);
router.delete("/:id", requireAdmin, UserController.deleteUser);

module.exports = router;