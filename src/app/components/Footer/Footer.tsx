import { Icon } from '../Icon';
import type { FooterProps } from './Footer.types';
import styles from './Footer.module.css';

export function Footer({ className }: Readonly<FooterProps>) {
  const githubUrl = 'https://github.com/Yamang02';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className ?? ''}`} data-shell>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <span className={styles.brand}>야망솔루션</span>
          <p className={styles.copyright}>
            © {currentYear}, Lee Jeongjun(Yamang02)
          </p>
          <div className={styles.links}>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="GitHub"
            >
              <Icon name="github" library="nucleo" size="sm" />
            </a>
          </div>
        </div>
        <dl className={styles.infoRow}>
          <div className={styles.infoItem}>
            <dt>대표자</dt>
            <dd>이정준</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>사업자등록번호</dt>
            <dd>882-30-01752</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>업태</dt>
            <dd>정보통신업</dd>
          </div>
          <div className={styles.infoItem}>
            <dt>종목</dt>
            <dd>컴퓨터 프로그래밍 서비스업</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
