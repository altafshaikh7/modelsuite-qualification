const Task = require('../models/Task');

// @desc  Get all available (Open) tasks
// @route GET /api/talent/tasks/available
// @access Talent
const getAvailableTasks = async (req, res) => {
  try {
    // (loose schema allows this inconsistent state from seed data)
    const tasks = await Task.find({ status: 'Open' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks assigned to the logged-in talent
// @route GET /api/talent/tasks/mine
// @access Talent
const getMyTasks = async (req, res) => {
  try {
    // all come back mixed together with no grouping
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Claim an open task
// @route PUT /api/talent/tasks/:id/claim
// @access Talent
const claimTask = async (req, res) => {
  try {
    // Ensure only Talent users can claim tasks
    if (req.user.role !== 'Talent') {
      return res.status(403).json({ message: 'Only Talent users can claim tasks' });
    }

    // Two talents can both pass the status === 'Open' check before either saves,
    // then both write Claimed. Proper fix: findOneAndUpdate({ _id, status: 'Open' })
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization: Talent can only access if task is Open OR assigned to them
    const isOpen = task.status === 'Open';
    const isAssignedToUser = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isOpen && !isAssignedToUser) {
      return res.status(403).json({ message: 'Access denied: You cannot access this task' });
    }

    // Only allow claiming if task is still Open
    if (task.status !== 'Open') {
      return res.status(400).json({ message: 'Task is no longer available' });
    }
    task.status = 'Claimed';
    task.assignedTo = req.user._id;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableTasks, getMyTasks, claimTask };
