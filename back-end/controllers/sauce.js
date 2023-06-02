const Sauce = require('../models/sauce');
const fs = require('fs');


exports.findAll = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


//TODO add if statement to check if req.file is present, else would be if not present then imageUrl would be empty. 
exports.createSauce = (req, res, next) => {
  let parsedSauce
  let imageUrl = null

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imageUrl = url + '/images/' + req.file.filename
    parsedSauce = JSON.parse(req.body.sauce);
  } else {
    parsedSauce = req.body;
  };
  const sauce = new Sauce({
    userId: parsedSauce.userId,
    name: parsedSauce.name,
    manufacturer: parsedSauce.manufacturer,
    description: parsedSauce.description,
    mainPepper: parsedSauce.mainPepper,
    imageUrl,
    heat: parsedSauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error.message || error
      });
    }
  );
};

exports.updateSauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
    };
  } else {
    sauce = {
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const sauceId = req.params.id;
  const like = req.body.like;
  Sauce.findOne({
    _id: sauceId
  }).then(
    (sauce) => {
      switch (like) {
        case 1:
          console.log('sauce liked');
          resetLikeStatus(sauce, userId);
          sauce.usersLiked.push(userId);
          sauce.likes++;
          break;
        case 0:
          console.log('Cancellin like/dislike')
          resetLikeStatus(sauce, userId);
          break;
        case -1:
          console.log('sauce disliked')
          resetLikeStatus(sauce, userId);
          sauce.usersDisliked.push(userId);
          sauce.dislikes++;
          break;
        default:
          throw 'Unrecognised like value'
      }
      Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
          res.status(200).json({
            message: 'Sauce like registered'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error.message || error
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error.message || error
      });
    }
  );
};

function resetLikeStatus(sauce, userId) {
  if (sauce.usersLiked.includes(userId)) {
    sauce.likes--;
    sauce.usersLiked = sauce.usersLiked.filter(e => e !== userId);
  }

  if (sauce.usersDisliked.includes(userId)) {
    sauce.dislikes--;
    sauce.usersDisLiked = sauce.usersDisLiked.filter(e => e !== userId);
  }
}
