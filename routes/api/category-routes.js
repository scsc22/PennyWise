const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//Gets all Categories with their associated Products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});
//This gets a specific cagetory with it's associated product
router.get('/:id', async (req, res) => {
try{
  const singleCategoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product}]
  });
  //Talk about if this follows industry standards
  if (singleCategoryData !== null) {
  res.status(200).json(singleCategoryData)
  } else {
    res.status(400).json('Improper Id')
  }
} catch(err) {
  res.status(500).json(err)
}
});
//Creates a new Category
router.post('/', async (req, res) => {
  try{
    const newCategory = await Category.create(req.body)
    res.status(200).json(newCategory)
  } catch(err){
    res.status(400).json(err)
  }
});
//This will update the Category 
router.put('/:id', async (req, res) => {
  try{
    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json('Successfully Updated')
  } catch(err) {
    res.status(400).json(err)
  }

});
//This will delete a Category 
router.delete('/:id', async (req, res) => {
  try{
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    if(!deletedCategory) {
      res.status(400).json({ message: 'No Category Found'})
    }
    res.status(200).json({message: 'Category has been deleted'});
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;