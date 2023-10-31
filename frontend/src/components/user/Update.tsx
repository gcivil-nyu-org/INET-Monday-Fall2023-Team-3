import { userGet, userUpdate } from "utils/backendRequests"
import { IUser } from "utils/models"
import { TextField, Alert, Button } from "@mui/material"
import { ChangeEvent, useState, useEffect } from "react"


export default function Update() {
  const [severity, setSeverity] = useState<"error" | "success">("error")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    userGet(sessionStorage.getItem("token")!)
      .then((result) => {
        if (result.status) {
          const user = result.value
          setEmail(user.email)
          setUsername(user.username)
        } else {
          setSeverity("error")
          setMessage("Cannot get current user")
        }
      })
  }, [])

  const onUsernameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onVerifyPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyPassword(event.target.value)
  }

  const onUpdateButtonClicked = () => {
    console.log(`new username ${username}`)
    console.log(`new password ${password}`)

    if (password !== verifyPassword) {
      setSeverity("error")
      setMessage("Password mismatch, please try again")
      return
    }

    const user: Partial<IUser> & Pick<IUser, "email"> = {
      email: email,
      username: username,
    }

    if (password !== "") {
      user.password = password
    }

    userUpdate(user, sessionStorage.getItem("token")!)
      .then((result) => {
        if (result.status) {
          setSeverity("success")
          setMessage("User update successful")
        } else {
          setSeverity("error")
          setMessage(result.error)
        }
      })
  }

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Username" variant="outlined" defaultValue={username} InputLabelProps={{ shrink: true }} onChange={onUsernameInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Password" type="password" variant="outlined" onChange={onPasswordInputChanged} />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Verify Password" type="password" variant="outlined" onChange={onVerifyPasswordInputChanged} />
      </div>
      {message !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity={severity}>{message}</Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onUpdateButtonClicked}>Update</Button>
      </div>
    </div>
  )
}
