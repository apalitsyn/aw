import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN } from './site';

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'AutoPartsStore',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  logo: DEFAULT_OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Каширское шоссе, 65А',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
  telephone: '+74958000095',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+74958000095',
      contactType: 'sales',
      email: 'artwheelss@gmail.com',
      areaServed: 'RU',
      availableLanguage: ['ru'],
    },
  ],
  sameAs: ['https://t.me/artwheels'],
};

export const OrganizationJsonLd = () => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(ORG)}</script>
    </Helmet>
  );
};

