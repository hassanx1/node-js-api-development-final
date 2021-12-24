// * @Author: Muwonge Hassan Saava

// * @Email: hassansaava@gmail.com

// * @LinkedIn: https://www.linkedin.com/in/hassan-muwonge-4a4592144/

// * @Github: https://github.com/mhassan654

// * @GitLab: https://gitlab.com/hmuwonge

// * @Tel: +256-783-828977 / +256-704-348792
// * Web: https://muwongehassan.com

const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(protect, createBootcamp);

router.route("/:id/photo").put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
router
  .route("/:id")
  .get(advancedResults(Bootcamp, 'courses'), getBootcamp)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);


module.exports = router;
