import { Icon } from '../Icon';
import styles from './Footer.module.css';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const githubUrl = 'https://github.com/Yamang02';
  const currentYear = new Date().getFullYear();

  const handleEmailClick = () => {
    window.location.href = 'mailto:yamang.solution@gmail.com';
  };

  return (
    <footer className={`${styles.footer} ${className ?? ''}`} data-ui>
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
            <button
              onClick={handleEmailClick}
              className={styles.iconLink}
              aria-label="Email"
            >
              <Icon name="email" library="material" size="sm" />
            </button>
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
