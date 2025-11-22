import { useEffect } from 'react';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Bisri Mustofa'
}) => {
    useEffect(() => {
        const siteUrl = window.location.origin;
        const currentUrl = url || window.location.href;
        const defaultImage = `${siteUrl}/og-image.jpg`;
        const ogImage = image || defaultImage;

        // Default values
        const siteTitle = 'Bisri Mustofa';
        const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
        const defaultDescription = 'Portfolio of Bisri Mustofa, a tech enthusiast and developer specializing in modern web technologies.';
        const metaDescription = description || defaultDescription;
        const defaultKeywords = 'Bisri Mustofa, Bisbiss, web developer, portfolio, tech enthusiast, React, JavaScript, full-stack developer';
        const metaKeywords = keywords || defaultKeywords;

        // Update document title
        document.title = fullTitle;

        // Helper function to set meta tag
        const setMetaTag = (name, content, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Set primary meta tags
        setMetaTag('title', fullTitle);
        setMetaTag('description', metaDescription);
        setMetaTag('keywords', metaKeywords);
        setMetaTag('author', author);

        // Set Open Graph tags
        setMetaTag('og:type', type, true);
        setMetaTag('og:url', currentUrl, true);
        setMetaTag('og:title', fullTitle, true);
        setMetaTag('og:description', metaDescription, true);
        setMetaTag('og:image', ogImage, true);
        setMetaTag('og:site_name', siteTitle, true);

        // Set Twitter Card tags
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:url', currentUrl);
        setMetaTag('twitter:title', fullTitle);
        setMetaTag('twitter:description', metaDescription);
        setMetaTag('twitter:image', ogImage);
        setMetaTag('twitter:creator', '@bisbiss');

        // Set additional meta tags
        setMetaTag('robots', 'index, follow');
        setMetaTag('language', 'English');
        setMetaTag('revisit-after', '7 days');

        // Set canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);

    }, [title, description, keywords, image, url, type, author]);

    return null;
};

export default SEO;
