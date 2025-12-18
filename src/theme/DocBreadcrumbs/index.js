import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import { useLocation } from '@docusaurus/router';

export default function DocBreadcrumbsWrapper(props) {
  const location = useLocation();

  if (location.pathname.startsWith('/api')) {
    return null;
  }

  return <DocBreadcrumbs {...props} />;
}
