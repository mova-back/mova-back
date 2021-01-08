const express = require('express');

const router = express.Router();

const profileController = require('./profile.conroller');
const { authByRole } = require('../../middlewares/jwtMiddleware');
const { UR } = require('../../constants');

// router.route('/:username').get(
//   catchErrors(async (req, res) => {
//     const { username } = req.params;
//     const user = await profileController.getUserByUsername(username);
//
//     if (!user) {
//       throw new NotFound('User not found.');
//     }
//
//     const { id } = user;
//     const profile = await profileController.getProfileById(id);
//     return res.status(200).json(profileSchema.toResponse(profile));
//   })
// );

// router
//   .route('/:username/follow')
//   .post(
//     catchErrors(async (req, res) => {
//       const { username } = req.params;
//       const user = await profileController.getUserByUsername(username);
//
//       if (!user) {
//         throw new NotFound('User not found.');
//       }
//
//       const { id } = user;
//       const profile = await profileController.addFollower(id, req.body);
//
//       if (!profile) {
//         throw new NotFound('Follower not found.');
//       }
//
//       const updatedProfile = await profileController.getProfileById(id);
//
//       return res.status(200).json(profileSchema.toResponse(updatedProfile));
//     })
//   )
//   .delete(
//     catchErrors(async (req, res) => {
//       const { username } = req.params;
//       const user = await profileController.getUserByUsername(username);
//
//       if (!user) {
//         throw new NotFound('User not found.');
//       }
//
//       const { id } = user;
//       const profile = await profileController.deleteFollower(id, req.body);
//
//       if (!profile) {
//         throw new NotFound('Follower not found.');
//       }
//
//       return res.status(200).json({ message: 'Follower successfully deleted.' });
//     })
//   );

router.route('/:username/promote').post(authByRole(UR), profileController.promoteToModerator);

module.exports = router;
