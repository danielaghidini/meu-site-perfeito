import { Helmet } from "react-helmet-async";

interface SEOProps {
	title?: string;
	description?: string;
	canonical?: string;
	ogType?: string;
	ogImage?: string;
	twitterHandle?: string;
	authorName?: string;
	publishedDate?: string;
	articleSection?: string;
}

const SEO = ({
	title,
	description,
	canonical,
	ogType = "website",
	ogImage = "/og-image.png",
	twitterHandle = "@meusiteperfeito",
	authorName = "Daniela Ghidini",
	publishedDate,
	articleSection,
}: SEOProps) => {
	const siteTitle = "Meu Site Perfeito";
	const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
	const defaultDescription =
		"Criamos sites modernos com React, integração a CMS Headless ou painel administrativo personalizado, totalmente otimizados para SEO.";
	const metaDescription = description || defaultDescription;
	const url = "https://meusiteperfeito.com.br"; // Update with actual domain if different

	const structuredData =
		ogType === "article"
			? {
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: fullTitle,
					description: metaDescription,
					image: `${url}${ogImage}`,
					author: {
						"@type": "Person",
						name: authorName,
					},
					datePublished: publishedDate,
					publisher: {
						"@type": "Organization",
						name: siteTitle,
						logo: {
							"@type": "ImageObject",
							url: `${url}/logo.png`,
						},
					},
					articleSection: articleSection,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": `${url}${canonical || ""}`,
					},
				}
			: {
					"@context": "https://schema.org",
					"@type": "ProfessionalService",
					name: siteTitle,
					image: `${url}/logo.png`,
					"@id": url,
					url: url,
					telephone: "+5511995019783",
					address: {
						"@type": "PostalAddress",
						streetAddress: "São Paulo",
						addressLocality: "São Paulo",
						addressRegion: "SP",
						addressCountry: "BR",
					},
					geo: {
						"@type": "GeoCoordinates",
						latitude: -23.5505,
						longitude: -46.6333,
					},
					openingHoursSpecification: {
						"@type": "OpeningHoursSpecification",
						dayOfWeek: [
							"Monday",
							"Tuesday",
							"Wednesday",
							"Thursday",
							"Friday",
						],
						opens: "09:00",
						closes: "18:00",
					},
					sameAs: [
						"https://github.com/danielaghidini",
						"https://www.linkedin.com/in/danielaghidini",
					],
				};

	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{fullTitle}</title>
			<meta name="description" content={metaDescription} />
			{canonical && <link rel="canonical" href={`${url}${canonical}`} />}

			{/* Open Graph tags */}
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:type" content={ogType} />
			<meta property="og:url" content={`${url}${canonical || ""}`} />
			<meta property="og:image" content={`${url}${ogImage}`} />
			<meta property="og:site_name" content={siteTitle} />

			{/* Twitter tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:creator" content={twitterHandle} />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<meta name="twitter:image" content={`${url}${ogImage}`} />

			{/* Structured Data (JSON-LD) */}
			<script type="application/ld+json">
				{JSON.stringify(structuredData)}
			</script>
		</Helmet>
	);
};

export default SEO;
