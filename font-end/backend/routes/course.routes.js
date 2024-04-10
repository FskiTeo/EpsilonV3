const router = require('express').Router();
const CourseController = require('../controllers/course.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

router.get('/',requireAuth, CourseController.getCourses);
router.get('/myCreatedCourses', requireAuth, CourseController.getMyCreatedCourses);
router.get('/availableCourses', requireAuth, CourseController.getAvailableCourses);
router.get('/myFollowedCourses', requireAuth, CourseController.getMyFollowedCourses);
router.post('/followCourse', requireAuth, CourseController.followCourse);
router.post('/createCourse', requireAuth, CourseController.createMyCourse);
router.put('/updateCourse', requireAuth, CourseController.updateMyCourse);
router.delete('/deleteCourse', requireAuth, CourseController.deleteMyCourse);

module.exports = router;