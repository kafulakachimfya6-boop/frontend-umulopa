import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import './auth.css'
import { useAppState } from '../../context/useAppState'
import { hashPassword } from '../../utils/password'

function Signup() {
  const { donors = [], setDonors, donorAccounts = [], setDonorAccounts, adminUsers = [], setAdminUsers, hospitals = [] } = useAppState()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (donorAccounts.some((a) => a.email?.toLowerCase() === normalizedEmail) || adminUsers.some((a) => a.email?.toLowerCase() === normalizedEmail)) {
      setError('An account with this email already exists.')
      return
    }
    setLoading(true)
    const id = `DON-${Date.now()}`
    const name = `${firstName.trim()} ${lastName.trim()}`.trim()
    const passwordHash = await hashPassword(password)
    const donor = { id, name, firstName: firstName.trim(), lastName: lastName.trim(), gender, dateOfBirth, bloodType: bloodGroup, phone, email: normalizedEmail, address, nearestHospitalId: hospitalId, status: 'Active', registeredAt: new Date().toISOString(), verified: false }
    const account = { id: `DA-${Date.now()}`, donorId: id, name, email: normalizedEmail, role: 'donor', hospital: '—', username: username.trim(), status: 'Active', passwordHash, createdAt: new Date().toISOString() }
    setDonors((v) => [...v, donor])
    setDonorAccounts((v) => [...v, account])
    setAdminUsers((v) => [...v, { ...account }])
    setLoading(false)
    setSuccess('ZNBTS donor account created successfully. You can now sign in.')
    setTimeout(() => navigate('/login/donor', { replace: true }), 500)
  }

  return (
    <AuthLayout
      title="Create your donor account"
      subtitle="Register in Ndola to help hospitals request blood from available donors quickly."
      eyebrow="Donor signup"
      footer={
        <>
          <span>Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-inline">
          <label className="field">
            <span className="label">First name</span>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" required />
          </label>
          <label className="field">
            <span className="label">Last name</span>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" required />
          </label>
        </div>

        <div className="field-inline">
          <label className="field">
            <span className="label">Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="field">
            <span className="label">Date of birth</span>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </label>
        </div>

        <div className="field-inline">
          <label className="field">
            <span className="label">Blood group</span>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
              <option value="">Select your blood group</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </label>
          <label className="field">
            <span className="label">Nearest hospital</span>
            <select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} required>
              <option value="">Select hospital</option>
              {hospitals.filter((h) => h.status === "Active" && h.province === "Copperbelt").map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="label">Phone number</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+260 XX XXX XXXX" required />
        </label>

        <div className="field-inline">
          <label className="field">
            <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </label>
          <label className="field">
            <span className="label">Username</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required />
          </label>
        </div>

        <label className="field">
          <span className="label">Address</span>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required minLength={8} />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        <label className="field">
          <span className="label">Confirm password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required minLength={8} />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        {error ? <p className="error-text" role="alert">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Signup;
