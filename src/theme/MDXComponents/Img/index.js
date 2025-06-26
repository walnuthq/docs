import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function MDXImg({ src, alt, width, height, className, ...rest }) {
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  return (
    <div
      className={styles.wrapper}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div className={styles.bg} />
      <img
        src={src}
        alt={alt || ''}
        decoding="async"
        loading="lazy"
        {...rest}
        className={clsx(styles.img, className)}
      />
    </div>
  );
}
