import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const SALT_ROUNDS = 12;

export async function createBeneficiary(req, res) {
  const { name, username, email, initialPassword } = req.body;

  if (!name || !username || !email || !initialPassword) {
    return res.status(400).json({ message: 'Name, username, email, and initial password are required.' });
  }
  if (initialPassword.length < 8) {
    return res.status(400).json({ message: 'Initial password must be at least 8 characters long.' });
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] }).lean();
  if (existing) {
    return res.status(409).json({ message: 'A user with that username or email already exists.' });
  }

  const passwordHash = await bcrypt.hash(initialPassword, SALT_ROUNDS);
  const beneficiary = await User.create({
    name,
    username,
    email,
    passwordHash,
    role: 'BENEFICIARY',
    status: 'ACTIVE',
    createdBy: req.user.id,
    mustChangePassword: true,
  });

  return res.status(201).json({
    message: 'Beneficiary created. They must change their password on first login.',
    beneficiary: {
      id: beneficiary._id.toString(),
      name: beneficiary.name,
      username: beneficiary.username,
      email: beneficiary.email,
      role: beneficiary.role,
      status: beneficiary.status,
      mustChangePassword: beneficiary.mustChangePassword,
      createdBy: beneficiary.createdBy ? beneficiary.createdBy.toString() : null,
      createdAt: beneficiary.createdAt,
    },
  });
}

export async function listBeneficiaries(req, res) {
  const beneficiaries = await User.find({ role: 'BENEFICIARY', createdBy: req.user.id })
    .populate('createdBy', 'username name email')
    .sort({ createdAt: -1 })
    .select('-passwordHash');

  return res.status(200).json({
    count: beneficiaries.length,
    beneficiaries: beneficiaries.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      status: u.status,
      mustChangePassword: u.mustChangePassword,
      createdAt: u.createdAt,
      createdBy: u.createdBy ? u.createdBy._id.toString() : null,
      createdByUsername: u.createdBy ? u.createdBy.username : null,
      createdByName: u.createdBy ? u.createdBy.name : null,
      createdByEmail: u.createdBy ? u.createdBy.email : null,
    })),
  });
}
