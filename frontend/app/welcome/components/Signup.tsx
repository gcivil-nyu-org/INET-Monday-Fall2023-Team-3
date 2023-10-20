'use client'
import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField } from "@mui/material"
import { fetchRestful } from "@/app/utils/helpers"
import { useRouter } from "next/navigation"

export default function Signup() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const onSingupButtonClicked = () => {
    console.log(`email: ${email}`)
    console.log(`username: ${username}`)
    console.log(`password: ${password}`)

    if (password !== verifyPassword) {
      setErrorMessage("Password mismatch, please try again")
      return
    }

    fetchRestful("/backend/user/signup", "POST", {
      email: email,
      username: username,
      password: password,
    }).then((response) => {
      response.json().then((obj) => {
        if (obj.detail) {
          setErrorMessage(obj.detail)
        } else {
          setErrorMessage("")
          console.log(obj)

          sessionStorage.setItem("token", obj.token)
          router.push("/user")
        }
      }, (err) => {
        console.error(err)
        setErrorMessage("Unexpected error process response")
      })
    }, (err) => {
      console.error(err)
      setErrorMessage("Unexpected error during request")
    })
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
        <TextField className="h-16 m-4 flex-1" label="Verify Password" type="password" variant="outlined" onChange={onVerifyPasswordInputChanged} />
      </div>
      {errorMessage !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity="error">{errorMessage}</Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onSingupButtonClicked}>Sign Up</Button>
      </div>
    </div>
  )

}
