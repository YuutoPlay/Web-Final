const Product = require("../models/productModel");
const upload = require('../config/multer');

exports.getAllProducts = async (req,res) => {
    try{
        const products = await Product.getAll();
        title = "List product"
        res.render('product/index',{products,title});
        
    }catch(err){
        res.status(500).send("Error fetching products");
    }
};

exports.renderCreateForm = (req,res)=>{
    title = "New Product"
    res.render('product/create',{title});
};

exports.createProduct = async(req,res)=>{
    try{
        const { name, description, price } = req.body;
        let image_path = "";
        // If there's an uploaded file, set the image path
        if (req.file) {
            image_path = `/uploads/${req.file.filename}`;
        }
        await Product.create({ name, description, price, image: image_path });
        res.redirect("/product");
    }catch(err){
        let backurl = '/product';
        req.flash('error', err.sqlMessage);
        return res.redirect(backurl);
    }
}

exports.getProductById = async (req,res) => {
    try {
        const product = await Product.getById(req.params.id);
        title = "Show product";
        if (product) {
          res.render('product/show', { product,title });
        } else {
          res.status(404).send('Product not found');
        }
      } catch (err) {
        res.status(500).send('Error fetching product');
      }
};

exports.renderEditForm = async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      title = "Edit Product";
      if (product) {
        res.render('product/edit', { product,title });
      } else {
        res.status(404).send('Product not found');
      }
    } catch (err) {
      res.status(500).send('Error fetching product');
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        let image_path = "";

        if (req.file) {
            image_path = `/uploads/${req.file.filename}`;
        }
        else{
            const product = await Product.getById(req.params.id);
            image_path = product.image;
            
        }
        await Product.update(req.params.id, { name, description, price, image: image_path });
        
        res.redirect('/product');
    } catch (err) {
      res.status(500).send('Error updating product');
    }
  };
  
  // Delete product
  exports.deleteProduct = async (req, res) => {
    try {
      await Product.delete(req.params.id);
      res.redirect('/product');
    } catch (err) {
      res.status(500).send('Error deleting product');
    }
  };