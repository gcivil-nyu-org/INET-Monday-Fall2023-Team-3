'use client'
import { ChangeEvent, useState } from "react"
import { Button } from "@mui/material"
import { TextField } from "@mui/material"

export default function Singup() {
  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)

  const onSingupButtonClicked = () => {
    console.log(`email: ${email}`)
    console.log(`username: ${username}`)
    console.log(`password: ${password}`)
  }

  const onEmailInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const onUsernameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onVerifyPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyPassword(event.target.value)
  }

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Email" variant="outlined" onChange={onEmailInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Username" variant="outlined" onChange={onUsernameInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Password" type="password" variant="outlined" onChange={onPasswordInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Verify Password" variant="outlined" onChange={onVerifyPasswordInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onSingupButtonClicked}>Sign Up</Button>
      </div>
    </div>
  )

}
