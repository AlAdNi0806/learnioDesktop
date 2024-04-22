import React from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { onLogout } = useAuth()
  const navigate = useNavigate();

  const handleSubmit = () => {
    onLogout()
    navigate('/')
  }
  return (
    <button onClick={handleSubmit}>
      logout
    </button>
  )
}

export default Profile