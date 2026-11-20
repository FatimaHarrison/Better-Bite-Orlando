import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
	if (!transporter) {
		const host = process.env.SMTP_HOST;
		const port = Number(process.env.SMTP_PORT);
		const user = process.env.SMTP_USER;
		const pass = process.env.SMTP_PASSWORD;

		if (!user || !pass) {
			throw new Error("SMTP configuration is missing");
		}

		transporter = nodemailer.createTransport({
			host,
			port,
			secure: false,
			auth: { user, pass },
		});
	}
	return transporter;
};

// HTML entity encoder to prevent HTML injection / XSS
const escapeHtml = (str = "") =>
	String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

// Email header sanitizer to prevent CRLF / header injection attacks
const sanitizeHeader = (str = "") =>
	String(str)
		.replace(/[\r\n]+/g, " ")
		.trim();

// Basic RFC 5322 compliant regex for email validation
const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const contactUs = async (req, res) => {
	try {
		const { name, email, subject, message, hp } = req.body;

		// 1. Honeypot check: silently accept spam bots to prevent adaptation
		if (hp && String(hp).trim().length > 0) {
			return res
				.status(200)
				.json({ success: true, message: "Message received." });
		}

		// 2. Presence validation
		if (!name || !email || !message) {
			return res
				.status(400)
				.json({ error: "Name, email, and message are required." });
		}

		// 3. Length enforcement
		const trimmedName = String(name).trim();
		const trimmedEmail = String(email).trim().toLowerCase();
		const trimmedSubject = subject
			? String(subject).trim()
			: "General Inquiry";
		const trimmedMessage = String(message).trim();

		if (trimmedName.length < 1 || trimmedName.length > 100) {
			return res
				.status(400)
				.json({ error: "Name must be between 1 and 100 characters." });
		}

		if (
			trimmedEmail.length < 5 ||
			trimmedEmail.length > 254 ||
			!EMAIL_REGEX.test(trimmedEmail)
		) {
			return res
				.status(400)
				.json({ error: "Please provide a valid email address." });
		}

		if (trimmedSubject.length > 150) {
			return res
				.status(400)
				.json({ error: "Subject must not exceed 150 characters." });
		}

		if (trimmedMessage.length < 5 || trimmedMessage.length > 3000) {
			return res.status(400).json({
				error: "Message must be between 5 and 3,000 characters.",
			});
		}

		// 4. Sanitize headers against CRLF injection
		const cleanName = sanitizeHeader(trimmedName);
		const cleanEmail = sanitizeHeader(trimmedEmail);
		const cleanSubject = sanitizeHeader(trimmedSubject);

		const fromAddress = process.env.SMTP_FROM;
		const teamAddress = process.env.SMTP_FROM;

		if (!teamAddress) {
			console.error(
				"[Contact Controller] Configuration error: Missing team recipient email.",
			);
			return res
				.status(500)
				.json({ error: "Contact service is temporarily unavailable." });
		}

		const mailer = getTransporter();

		// Sends message to internal team (Plain text + safely escaped HTML)
		const teamMailOptions = {
			from: `"${cleanName} (via Contact Form)" <${fromAddress}>`,
			to: teamAddress,
			replyTo: cleanEmail,
			subject: `[Contact Form] ${cleanSubject}`,
			text: `From: ${cleanName} (${cleanEmail})\nSubject: ${cleanSubject}\n\nMessage:\n${trimmedMessage}`,
			html: `
        <h3>New Contact Submission</h3>
        <p><strong>From:</strong> ${escapeHtml(cleanName)} (&lt;${escapeHtml(cleanEmail)}&gt;)</p>
        <p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
        <hr />
        <p style="white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
      `,
		};

		// 6. Send auto-reply to user
		const autoReplyOptions = {
			from: `"Better Bite Orlando" <${fromAddress}>`,
			to: cleanEmail,
			subject: `Thank you for reaching out: ${cleanSubject}`,
			text: ``,
			html: `
                <p>Hello ${escapeHtml(cleanName)},</p><br />
                <p>Thank you for contacting Better Bite Orlando.</p><br /> 
	            <p>We've received your message and appreciate you taking the time to reach out. Our team 
                will review your inquiry.</p><br /> 
                <p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p><br /> 
                <p style="color: #666; font-size: 0.9em;"><em>This is an automated acknowledgement. 
                Please do not include sensitive personal information in follow-up messages.</em></p><br />

        
                <p>Best regards,</p>
	
                <p>The Better Bite Orlando Team</p>

	            <p>info@betterbiteorlando.com</p>
      `,
		};

		// Execute email sends concurrently
		await Promise.all([
			mailer.sendMail(teamMailOptions),
			mailer.sendMail(autoReplyOptions),
		]);

		return res.status(200).json({
			success: true,
			message: "Your message has been sent successfully.",
		});
	} catch (error) {
		// Log safe error metadata only; never log request body or user PII
		console.error(
			"[Contact Controller] Mail dispatch failure:",
			error.code || error.name || "UnknownError",
		);
		return res.status(500).json({
			error: "Unable to process your request at this time. Please try again later.",
		});
	}
};

export default contactUs;
