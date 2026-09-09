import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";
import { type ContactScope, scopeLabels } from "../lib/contact-scope";

export interface ContactNotificationProps {
	name: string;
	email: string;
	message: string;
	requestId: string;
	locale: "pt-PT" | "en";
	scope?: ContactScope;
	logoUrl?: string;
	whatsapp: string;
	requestType: string;
	country: string;
}

const copy = {
	"pt-PT": {
		title: "Novo pedido de contacto",
		greeting: "Olá",
		confirmation:
			"Recebeu um novo pedido através do formulário do site. Pode responder diretamente a este email para contactar a pessoa.",
		message: "Mensagem",
		reference: "Referência",
		details: "Dados do pedido",
		name: "Nome",
		website: "Visitar o site",
		privacy: "Privacidade",
		requestType: "Tipo de pedido",
		country: "País",
	},
	en: {
		title: "New contact request",
		greeting: "Hello",
		confirmation:
			"A new request was submitted through the website. Reply directly to this email to contact the sender.",
		message: "Message",
		reference: "Reference",
		details: "Request details",
		name: "Name",
		website: "Visit the website",
		privacy: "Privacy",
		requestType: "Request type",
		country: "Country",
	},
} as const;

const paragraph: React.CSSProperties = {
	fontFamily: '"Fira Sans", Arial, sans-serif',
	fontSize: "16px",
	lineHeight: "26px",
	color: "#140607",
	overflowWrap: "anywhere",
};

export default function ContactNotification({
	name,
	email,
	message,
	requestId,
	locale,
	scope,
	logoUrl = "https://anatrevizan.com/emails/logo.png",
	whatsapp,
	requestType,
	country,
}: ContactNotificationProps) {
	const text = copy[locale];
	const siteUrl =
		locale === "en" ? "https://anatrevizan.com/en" : "https://anatrevizan.com";
	const divider: React.CSSProperties = {
		border: "none",
		borderTop: "1px solid #d8c9be",
		margin: "28px 0",
	};
	const label: React.CSSProperties = {
		...paragraph,
		fontSize: "16px",
		color: "#5f5654",
		margin: "0 0 4px",
	};
	return (
		<Html lang={locale}>
			<Head>
				<style>{`@font-face { font-family: 'Playfair Display'; font-style: normal; font-weight: 400 900; src: url('https://anatrevizan.com/fonts/playfair-display-variable.woff2') format('woff2'); }`}</style>
			</Head>
			<Preview>{text.title} — Ana Trevizan</Preview>
			<Body
				style={{
					...paragraph,
					backgroundColor: "#f4ede1",
					margin: "0",
					padding: "24px 12px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						maxWidth: "580px",
						borderTop: "4px solid #4a1519",
					}}
				>
					<Section style={{ padding: "32px 24px 28px" }}>
						<Link href={siteUrl}>
							<Img
								src={logoUrl}
								alt="Ana Trevizan"
								width="240"
								height="74"
								style={{ display: "block", maxWidth: "100%", height: "auto" }}
							/>
						</Link>
					</Section>
					<Section style={{ padding: "0 24px" }}>
						<Heading
							as="h1"
							style={{
								fontFamily: '"Playfair Display", Georgia, serif',
								fontSize: "30px",
								lineHeight: "38px",
								color: "#4a1519",
								margin: "0 0 20px",
							}}
						>
							{text.title}
						</Heading>
						<Text style={{ ...paragraph, margin: "0 0 20px" }}>
							{text.greeting} Ana,
						</Text>
						<Text style={{ ...paragraph, margin: "0" }}>
							{text.confirmation}
							{scope && ` ${scopeLabels[locale][scope]}`}
						</Text>
						<Hr style={divider} />
						<Heading
							as="h2"
							style={{ ...paragraph, fontWeight: "bold", margin: "0 0 16px" }}
						>
							{text.details}
						</Heading>
						{[
							[text.name, name],
							["Email", email],
							["WhatsApp", whatsapp || "—"],
							[text.requestType, requestType],
							[text.country, country],
							[text.reference, requestId],
						].map(([title, value]) => (
							<Section
								key={title}
								style={{ paddingBottom: "16px", tableLayout: "fixed" }}
							>
								<Text style={label}>{title}</Text>
								<Text
									style={{ ...paragraph, margin: "0", wordBreak: "break-word" }}
								>
									{value}
								</Text>
							</Section>
						))}
						<Text style={label}>{text.message}</Text>
						<Text style={{ ...paragraph, margin: "0" }}>
							{message.split(/\r?\n/).map((line, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Static email lines never reorder and can repeat.
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</Text>
					</Section>
					<Section style={{ padding: "0 24px 32px" }}>
						<Hr style={divider} />
						<Text style={{ ...paragraph, margin: "0" }}>
							<Link
								href={siteUrl}
								style={{ color: "#4a1519", textDecoration: "underline" }}
							>
								{text.website}
							</Link>
							{" · "}
							<Link
								href={
									locale === "en"
										? `${siteUrl}/privacy-policy`
										: `${siteUrl}/politica-de-privacidade`
								}
								style={{ color: "#4a1519", textDecoration: "underline" }}
							>
								{text.privacy}
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

// Fictional data used only by the local React Email preview server.
ContactNotification.PreviewProps = {
	name: "Maria Exemplo",
	email: "maria@example.com",
	message:
		"Esta é uma mensagem de exemplo para pré-visualização.\nGostaria de obter mais informações.",
	requestId: "00000000-0000-4000-8000-000000000001",
	locale: "pt-PT",
	logoUrl: "/static/logo.png",
	whatsapp: "+351 912 345 678",
	requestType: "Pedido de informações (exemplo)",
	country: "Portugal",
} satisfies ContactNotificationProps;
