const express = require('express');
const router = express.Router();
const passport = require('passport');

const Bot = require('../../models/Bot');

// @route POST api/bots
// @desc Create a bot
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newBot = new Bot({
    user: req.user.id,
    name: req.body.name,
    description: req.body.description
  });

  newBot.save().then(bot => res.json(bot));
});

// @route GET api/bots
// @desc Get all bots for a user
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Bot.find({ user: req.user.id })
    .then(bots => res.json(bots))
    .catch(err => res.status(404).json({ nobotsfound: 'No bots found' }));
});

// @route DELETE api/bots/:id
// @desc Delete a bot
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Bot.findById(req.params.id)
    .then(bot => {
      if (bot.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'User not authorized' });
      }

      bot.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ botnotfound: 'No bot found' }));
});

module.exports = router;
