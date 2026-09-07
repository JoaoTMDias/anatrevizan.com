import ContactConfirmation from "./ContactConfirmation";

// Preview entrypoint: production continues to use ContactConfirmation directly.
export default function ContactConfirmationEN() {
	return (
		<ContactConfirmation
			{...ContactConfirmation.PreviewProps}
			locale="en"
			message={
				"This is a sample message for preview.\nI would like more information."
			}
		/>
	);
}
