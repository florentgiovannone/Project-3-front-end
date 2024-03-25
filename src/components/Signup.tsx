import { SyntheticEvent, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirmation: ""
  })

  const [errorData, setErrorData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirmation: ""
  })

  function handleChange(e: any) {
    const fieldName = e.target.name
    const newFormData = structuredClone(formData)
    newFormData[fieldName as keyof typeof formData] = e.target.value
    setFormData(newFormData)
  }

  async function handleSubmit(e: SyntheticEvent) {
    try {
      e.preventDefault()
      const resp = await axios.post('/api/rouge/user', formData)
      console.log(resp.data)
      navigate('/login')
    } catch (e: any) {
      setErrorData(e.response.data.errors)
    }
  }

  console.log(errorData)

  return <div className="section">
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="field  mt-4">
          <label className="label">Username</label>
          <div className="control">
            <input
              className="input border-is-rouge"
              placeholder="Username"
              type="text"
              name={'username'}
              onChange={handleChange}
              value={formData.username}
            />
            {errorData.username && <small className="has-text-danger">{errorData.username}</small>}
          </div>
        </div>
        <div className="field  mt-4">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input border-is-rouge"
              placeholder="Email"
              type="text"
              name={'email'}
              onChange={handleChange}
              value={formData.email}
            />
            {errorData.email && <small className="has-text-danger">{errorData.email}</small>}
          </div>
        </div>
        <div className="field  mt-4">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input border-is-rouge"
              placeholder="Password"
              type="password"
              name={'password'}
              onChange={handleChange}
              value={formData.password}
            />
            {errorData.password && <small className="has-text-danger">{errorData.password}</small>}
          </div>
        </div>
        <div className="field  mt-4">
          <label className="label">Confirm password</label>
          <div className="control">
            <input
              className="input border-is-rouge"
              placeholder="Confirm password"
              type="password"
              name={'passwordConfirmation'}
              onChange={handleChange}
              value={formData.passwordConfirmation}
            />
            {errorData.passwordConfirmation && <small className="has-text-danger">{errorData.passwordConfirmation}</small>}
          </div>
        </div>
        <button className="button border-is-rouge  mt-4">Submit</button>
      </form>
    </div>
  </div>
}