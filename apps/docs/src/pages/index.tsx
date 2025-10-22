import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const logoUrl = useBaseUrl('img/logo.svg');
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroContainer)}>
        <img className={styles.logo} src={logoUrl} alt={`${siteConfig.title} logo`} />
        <Heading as="h1" className={styles.title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.subtitle}>Plenty of hooks at your disposal.</p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/lukonik/plenty-hooks"
          >
            Star on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Plenty of hooks at your disposal."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
