import { withSessionSsr  } from "./lib/config/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user && user.permissions === 1){
      return { props: {user: user } }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        }
      }
    }

  }
)

export default function Admin(props){
  return (
    <>
      <h1>Admin Page!</h1>
      <div> logged in as <b>{props.user.username}</b></div>
      <div>
        <a href="/">home</a>
      </div>
    </>
  );
}