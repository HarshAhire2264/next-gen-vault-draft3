import User from '../models/User.js';

export async function listPendingRegistrations(req, res) {
  const pending = await User.find({ status: 'PENDING', role: 'OWNER' })
    .sort({ createdAt: 1 })
    .select('-passwordHash');

  return res.status(200).json({
    count: pending.length,
    registrations: pending.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    })),
  });
}

export async function approveUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id).select('-passwordHash');

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (user.status !== 'PENDING') {
    return res.status(400).json({ message: `User is not pending (current status: ${user.status}).` });
  }

  user.status = 'ACTIVE';
  user.role = 'OWNER';
  await user.save();

  return res.status(200).json({
    message: 'User approved. They may now log in.',
    user: {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}

export async function rejectUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id).select('-passwordHash');

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (user.status !== 'PENDING') {
    return res.status(400).json({ message: `User is not pending (current status: ${user.status}).` });
  }

  user.status = 'REJECTED';
  await user.save();

  return res.status(200).json({
    message: 'User rejected.',
    user: {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}
