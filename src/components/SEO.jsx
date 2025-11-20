import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Bisri Mustofa'
}) => {
    const siteUrl = window.location.origin;
    const currentUrl = url || window.location.href;
    const defaultImage = `${siteUrl}/og-image.jpg`; // You can create this later
    const ogImage = image || defaultImage;

    // Default values
    const siteTitle = 'Bisbiss | Bisri Mustofa';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = 'Portfolio of Bisri Mustofa, a tech enthusiast and developer specializing in modern web technologies.';
    const metaDescription = description || defaultDescription;
    const defaultKeywords = 'Bisri Mustofa, Bisbiss, web developer, portfolio, tech enthusiast, React, JavaScript, full-stack developer';
    const metaKeywords = keywords || defaultKeywords;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:creator" content="@bisbiss" />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
        </Helmet>
    );
};

export default SEO;
