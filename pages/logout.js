export function getServerSideProps(){
  try {
    fetch("/api/logout", { method: "POST" });
    return {props: {success: true}}
  } catch {
    return {props: {success: false}}
  }
}

export default function logout(props){
  return (<>
    {props.success ? "logged out successfully" : "failed to logout"}
  </>);
}