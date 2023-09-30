import { withSessionSsr  } from "helpers/lib/config/withSession";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';


export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user }}
    } else {
      return {props: { signedin: false, user: null }}
    }
  }
  
);

export default function Login(props){
  const router = useRouter();
  const usernameInput = useRef();
  const passwordIndput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameInput.current.value;
    const password = passwordIndput.current.value;

    if(username !== "" && password !== "") {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
      });

      if(res.status === 200){
        return router.push("/");
      } else {
        toast.error('Incorrect username or password');
      }
    } else {
      toast.error("You must enter both a username and password.");
    }
  }
  
  if(!props.signedin){
    return (
      <>
        <Toaster/>
        <Head>
          <title>Login | Caravel Table Tennis</title>
        </Head>
        <section className="centercontent">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">username: </label>
              <input type="text" id="username" ref={usernameInput} />
            </div>
            <div>
              <label htmlFor="password">password: </label>
              <input type="password" id="password" ref={passwordIndput} />
            </div>
            <button type="submit">Sign In</button>
          </form>
        </section>
      </>
    );
  } else {
    return (
      <>
        <h1>Login page</h1>
        <div>Already signed in as {props.user.username}</div>
        <div><a href="/">Home</a></div>
      </>
    );
  }
}