import styles from './index.less';
import logo from './logo.svg';

export default function IndexPage() {
  return (
    <div className={styles.app}>
      <img src={logo} className={styles['app-logo']} alt="logo" />
      <pre style={{margin: '1em 0'}}>
        <code>window.blocklet = {JSON.stringify(window.blocklet, null, 2)}</code>
      </pre>
      <a className={styles['app-link']} href="https://docs.arcblock.io/abtnode/" target="_blank" rel="noopener noreferrer">
        Learn Blocklet
      </a>
    </div>
  );
}
