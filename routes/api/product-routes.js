const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag, through: ProductTag}]
    });
    res.status(200).json(productData)
  } catch(err) {
    res.status(500).json(err)
  };
});

// get one product
router.get('/:id', async (req, res) => {
  try{
    const singleProductData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag, through: ProductTag}]
    });
    //Talk about if it follows the industry standards
    if (singleProductData !== null) {
    res.status(200).json(singleProductData)
    } else {
      res.status(400).json('Improper Id')
    }
  } catch(err) {
    res.status(500).json(err)
  };
});


//I believe there is a bug here at the post/put route
// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 3
      tagIds: [1, 2, 3, 4]
    }
  */
 
try {
  const newProduct = await Product.create(req.body)
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }
      if (req)
      // if no product tags, just respond
      res.status(200).json(newProduct);
    } catch(err) {
      console.log(err);
      res.status(400).json(err);
    };
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  //
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
//This deletes a product
router.delete('/:id', async (req, res) => {
  try{
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    })
    if(!deletedProduct){
      res.status(400).json({ message: 'No product found'})
    }
    res.status(200).json({message: "Successfully Deleted"})
  } catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;