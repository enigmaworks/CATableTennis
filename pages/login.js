import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Login(){
  const router = useRouter();
  const usernameInput = useRef();
  const passwordIndput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameInput.current.value;
    const password = passwordIndput.current.value;
  
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password})
    });

    if(res.ok){
      // re-route to proper page
      //return router.push("/page");
    }
  }
  return (
  <form onSubmit={handleSubmit}>
    <label htmlFor="username">username: </label>
    <input type="text" id="username" ref={usernameInput} />
    <label htmlFor="password">password: </label>
    <input type="password" id="password" ref={passwordIndput} />
    <button type="submit">Sign In</button>
  </form>
  );
}