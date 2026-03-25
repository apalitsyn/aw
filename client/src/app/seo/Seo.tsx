import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_NAME } from './site';
import { getCanonicalUrl } from './getCanonicalUrl';

export type SeoProps = {
  title: string;
  description?: string;
  pathname: string;
  search?: string;
  robots?: string;
  ogImage?: string;
};

const DEFAULT_DESCRIPTION =
  'Интернет-магазин ArtWheels: диски и шины. Поможем подобрать комплект под ваш автомобиль.';

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  pathname,
  search = '',
  robots = 'index,follow',
  ogImage = DEFAULT_OG_IMAGE,
}: SeoProps) => {
  const canonical = getCanonicalUrl(pathname, search);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

