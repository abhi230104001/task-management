const User = require('../models/User');
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const query = {};
    if (req.query.role) query.role = req.query.role;
    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(startIndex).limit(limit).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.createUser = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
