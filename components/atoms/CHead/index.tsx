import NextHead from 'next/head';
import React from 'react';

interface Props {
  title: string;
  description: string;
  ogImage: string;
  favicon: string;
}

export const CHead: React.FC<Props> = ({ title, description, ogImage, favicon }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <link rel="icon" type="image/vnd.microsoft.icon" href={favicon} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
          `
        }}
      />
    </NextHead>
  );
};
