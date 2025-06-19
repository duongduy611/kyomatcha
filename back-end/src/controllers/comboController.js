const Combo = require('../models/ComboModel');

// Get all combos
const getAllCombos = async (req, res) => {
  try {
    console.log('Starting getAllCombos...');
    console.log('Mongoose connection state:', require('mongoose').connection.readyState);
    
    const combos = await Combo.find({});
    console.log('Query completed. Found combos:', combos);
    
    // Kiểm tra model name và collection name
    console.log('Model name:', Combo.modelName);
    console.log('Collection name:', Combo.collection.name);
    
    res.status(200).json({
      status: 'success',
      data: combos || [] // Ensure we always return an array
    });
  } catch (error) {
    console.error('Error in getAllCombos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching combos',
      error: error.message
    });
  }
};

// Get combo by ID
const getComboById = async (req, res) => {
  try {
    const { comboId } = req.params;
    const combo = await Combo.findById(comboId);
    
    if (!combo) {
      return res.status(404).json({
        status: 'error',
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: combo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching combo',
      error: error.message
    });
  }
};

// Create new combo
const createCombo = async (req, res) => {
  try {
    const {
      title,
      products,
      matcha,
      note,
      description,
      images,
      suitableFor,
      price
    } = req.body;

    const newCombo = await Combo.create({
      title,
      products,
      matcha,
      note,
      description,
      images,
      suitableFor,
      price
    });

    res.status(201).json({
      status: 'success',
      data: newCombo
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error creating combo',
      error: error.message
    });
  }
};

// Update combo
const updateCombo = async (req, res) => {
  try {
    const { comboId } = req.params;
    const updateData = req.body;

    const updatedCombo = await Combo.findByIdAndUpdate(
      comboId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCombo) {
      return res.status(404).json({
        status: 'error',
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedCombo
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating combo',
      error: error.message
    });
  }
};

// Delete combo
const deleteCombo = async (req, res) => {
  try {
    const { comboId } = req.params;
    const deletedCombo = await Combo.findByIdAndDelete(comboId);

    if (!deletedCombo) {
      return res.status(404).json({
        status: 'error',
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Combo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting combo',
      error: error.message
    });
  }
};

module.exports = {
  getAllCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo
};
