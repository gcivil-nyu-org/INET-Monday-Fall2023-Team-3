'use client'
import { ChangeEvent, useState } from "react"
import { Alert, Button, TextField } from "@mui/material"

import { useRouter } from "next/navigation"
import { userLogin } from "@/app/utils/backendRequests"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const onLoginButtonClicked = () => {
    console.log(`email: ${email}`)
    console.log(`password: ${password}`)
    userLogin({
      email: email,
      password: password,
    }).then((result) => {
      if (result.status) {
        setErrorMessage("")
        console.log(result.value)

        sessionStorage.setItem("token", result.value.token)
        router.push("/user")
      } else {
        setErrorMessage(result.error)
        console.error(result.error)
      }
    })
  }

  const onEmailInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Email" variant="outlined" onChange={onEmailInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Password" type="password" variant="outlined" onChange={onPasswordInputChanged} />
      </div>
      {errorMessage !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity="error">{errorMessage}</Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onLoginButtonClicked}>Log In</Button>
      </div>
    </div>
  )
}
