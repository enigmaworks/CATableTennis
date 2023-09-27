import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/about.module.css";
import Head from 'next/head';

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

export default function about() {
  return (
    <>
      <Head>
        <title>About | Caravel Table Tennis</title>
      </Head>
      <header className={styles.heading}>
        <img className={styles.logo} alt="Catt logo" src="/CATTLogo.png" />
        <h1>About CATT</h1>
      </header>
      <section>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
        </p>
        <p>
        Vitae tortor condimentum lacinia quis vel eros donec ac odio. Egestas egestas fringilla phasellus faucibus
        scelerisque eleifend donec. Ridiculus mus mauris vitae ultricies. Iaculis urna id volutpat lacus laoreet non
        curabitur gravida arcu. Eu ultrices vitae auctor eu augue ut lectus. Erat nam at lectus urna duis. Aenean
        sed adipiscing diam donec. Fermentum leo vel orci porta non pulvinar neque. Fermentum et sollicitudin ac
        orci phasellus egestas tellus. Quam id leo in vitae turpis massa sed elementum. Vitae aliquet nec
        ullamcorper sit amet risus nullam eget felis.
        </p>
      </section>
    </>
  );
};
