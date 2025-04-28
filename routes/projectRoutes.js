const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateToken } = require('../middleware/token');

router.use(validateToken);

router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getAllProjects);

router.post('/projects/:projectId/episodes', projectController.createEpisode);
router.get('/projects/:projectId/episodes', projectController.getAllEpisodesOfProject);
router.get('/projects/:projectId/episodes/:episodeId', projectController.getEpisodeById);
router.put('/projects/:projectId/episodes', projectController.updateEpisodeTranscript);
router.delete('/projects/:projectId/episodes/:episodeId', projectController.deleteEpisodeById);

module.exports = router;