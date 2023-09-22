import styles from "/styles/calendar.module.css";

export default function calendar(){
  // will be replaceable by an admin
  const calendarLink = "https://calendar.google.com/calendar/embed?src=c_6a41f08e8a8478e98747d458eb4b5b713961521ea88eb365fe5820349cd93a7d%40group.calendar.google.com&ctz=America%2FNew_York";

  return (<>
    <header>
      <h1>Calendar</h1>
    </header>
    <iframe className={styles.calendarframe} src={calendarLink} frameborder="0"></iframe>
  </>);
}