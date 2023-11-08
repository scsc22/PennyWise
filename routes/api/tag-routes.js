const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
//This gets all the tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag}]
    })
    res.status(200).json(tagData)
  } catch(err) {
    res.status(500).json(err)
  };
});
//This gets a single tag
router.get('/:id', async (req, res) => {
  try {
    const singleTagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag}]
    });
    if (singleTagData !== null) {
      res.status(200).json(singleTagData)
      } else {
        res.status(400).json('Improper Id')
      };
  } catch(err) {
    res.status(500).json(err);
  };
});
//This creates a tag
router.post('/', async (req, res) => {
  try{
    const newTag = await Tag.create(req.body)
    res.status(200).json(newTag)
  } catch(err) {
    res.status(400).json(err)
  }
});
//This updates a tag
router.put('/:id', async (req, res) => {
  try {
    await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json('Successfully Updated')
  } catch(err) {
    res.status(400).json(err)
  }
});
//This deletes a tag
router.delete('/:id', async (req, res) => {
  const deletedTag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  if(!deletedTag){
    res.status(400).json({ message: 'No Tag found' })
  }
  res.status(200).json({ message: 'Successfully Deleted'})
});

module.exports = router;