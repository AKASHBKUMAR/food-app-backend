const foodModel = require("./../Models/FoodModel");
const fileSystem = require("fs");

const addFood = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "failure", message: "Image file is required." });
  }

  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    res.status(400).json({ success: "false", message: "Error" });
  }
};


const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: "false", message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ status: "failure", message: "Food item not found." });
    }

    // Remove the image file
    fileSystem.unlink(`uploads/${food.image}`, (err) => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("Error removing food:", error.message);
    res.status(400).json({ success: false, message: "Error" });
  }
};


module.exports ={addFood, listFood,removeFood};
