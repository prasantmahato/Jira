// controllers/taskController.js
import Task from '../models/Task.js';

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findById(id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Invalid ID format' });
    }
  };

// POST: Create a task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT: Update a task by ID
const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true, // return updated task
      runValidators: true, // validate against schema
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Task.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid ID format' });
    }
  };

export { getTasks, getTaskById, createTask, updateTask, deleteTask };
