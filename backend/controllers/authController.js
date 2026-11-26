import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";



const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, zipcode } = req.body || {};

    // Validate required fields
    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      typeof zipcode !== "string" ||
      !/^\d{5}(-\d{4})?$/.test(zipcode)
    ) {
      return res.status(400).json({
        error: "Invalid or missing registration fields",
      });
    }

    if (
      firstName.trim().length > 50 ||
      lastName.trim().length > 50 ||
      email.trim().length > 100 ||
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Registration field length is invalid",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (userExists) {
      return res.status(409).json({
        error: "An account already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        defaultZipCode: zipcode,
      },
    });

    const token = generateToken(newUser.id, res);

    return res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          zipcode: newUser.defaultZipCode,
        },
        token,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "An account already exists with this email",
      });
    }

    console.error("Registration failed:", error.message);

    return res.status(500).json({
      error: "Unable to register user",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    console.log("[LOCAL DEBUG] User found:", Boolean(user));

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    console.log("[LOCAL DEBUG] Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user.id, res);

    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          zipcode: user.defaultZipCode,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      error: "Unable to log in",
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("bbo_auth", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

const mailer = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT || 587),
	secure: Number(process.env.SMTP_PORT || 587) === 465,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

const forgotPassword = async (req, res) => {
	const email = req.body?.email;

	if (typeof email !== "string" || !email.trim()) {
		return res.status(400).json({
			error: "A valid email address is required",
		});
	}

	const response = {
		status: "success",
		message: "If an account exists, a password reset link will be sent.",
	};

	try {
		const user = await prisma.user.findUnique({
			where: { email: email.trim() },
		});

		// Keep the response identical to avoid revealing registered emails.
		if (!user) {
			return res.status(200).json(response);
		}

		const token = crypto.randomBytes(32).toString("hex");
		const tokenHash = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordResetToken: tokenHash,
				passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
			},
		});

		// This frontend page submits the token and password to the API.
		const resetUrl = new URL("/reset-password", process.env.FRONTEND_URL);
		resetUrl.searchParams.set("token", token);

		try {
			await mailer.sendMail({
				from: process.env.SMTP_FROM,
				to: user.email,
				subject: "Reset your password",
				text:
					`Reset your password using this link:\n${resetUrl.toString()}\n\n` +
					"This link expires in 15 minutes. " +
					"If you did not request this, ignore this email.",
			});
		} catch (error) {
			// Do not clear a newer token from a concurrent request.
			await prisma.user.updateMany({
				where: {
					id: user.id,
					passwordResetToken: tokenHash,
				},
				data: {
					passwordResetToken: null,
					passwordResetExpires: null,
				},
			});

			console.error("Password reset email delivery failed");
		}

		return res.status(200).json(response);
	} catch (error) {
		console.error("Password reset request failed");

		return res.status(500).json({
			error: "Unable to process the password reset request",
		});
	}
};

const resetPassword = async (req, res) => {
	const { token, password } = req.body || {};

	if (
		typeof token !== "string" ||
		!/^[a-f0-9]{64}$/.test(token) ||
		typeof password !== "string"
	) {
		return res.status(400).json({
			error: "A valid reset token and new password are required",
		});
	}

	// bcrypt limitation
	if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
		return res.status(400).json({
			error: "Password must be at least 12 characters and at most 72 bytes",
		});
	}

	try {
		const tokenHash = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const hashedPassword = await bcrypt.hash(password, 10);

		// Atomically update the password and consume the token.
		// Concurrent submissions cannot reuse the same token.
		const result = await prisma.user.updateMany({
			where: {
				passwordResetToken: tokenHash,
				passwordResetExpires: { gt: new Date() },
			},
			data: {
				passwordHash: hashedPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
			},
		});

		if (result.count === 0) {
			return res.status(400).json({
				error: "Reset token is invalid or has expired",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Password reset successfully. Please log in.",
		});
	} catch (error) {
		console.error("Password reset failed");

		return res.status(500).json({
			error: "Unable to reset password",
		});
	}
};

// GET /auth/profile
// Return the currently authenticated user's information
const getCurrentUser = async (req, res) => {
  try {
    // Retrieve the JWT from the authentication cookie
    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if (!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    // Verify the existing authentication token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!Number.isInteger(decoded.id)) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // Retrieve the user without sensitive fields
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        defaultZipCode: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }


    const savedPreferences = await prisma.user_preferences.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: {
        preference_id: "desc",
      },
      select: {
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        is_organic: true,
        is_low_carb: true,
        is_high_protein: true,

        // notification preferences
        email_notifications: true,
        recipe_recommendations: true,
        local_food_events: true,
        new_resources: true,
      },


    });





    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          zipcode: user.defaultZipCode,

          dietaryPreferences: {
            vegetarian: savedPreferences?.is_vegetarian ?? false,
            vegan: savedPreferences?.is_vegan ?? false,
            glutenFree: savedPreferences?.is_gluten_free ?? false,
            organic: savedPreferences?.is_organic ?? false,
            lowCarb: savedPreferences?.is_low_carb ?? false,
            highProtein: savedPreferences?.is_high_protein ?? false,
          },

          notificationPreferences: {
            emailNotifications:
              savedPreferences?.email_notifications ?? true,

            recipeRecommendations:
              savedPreferences?.recipe_recommendations ?? true,

            localFoodEvents:
              savedPreferences?.local_food_events ?? false,

            newResources:
              savedPreferences?.new_resources ?? true,
          },

        },
      },
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    console.error("Get current user failed:", error);

    return res.status(500).json({
      error: "Unable to retrieve user information",
    });
  }
};

// PATCH /auth/profile
// Update the currently authenticated profile 
const updateProfile = async (req, res) => {
  try {

    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if(!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded !== "object" ||
      !Number.isInteger(decoded.id) ||
      decoded.id < 1
    ) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    const {
      firstName,
      lastName,
      zipcode,
    dietaryPreferences
   } = req.body || {};

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof zipcode !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid profile informaiton",
      });
    }

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanZipcode = zipcode.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      cleanFirstName.length > 50 ||
      cleanLastName.length > 50 ||
      !/^\d{5}$/.test(cleanZipcode)
    ) {
      return res.status(400).json({
        error: "Enter valid names and a 5-digit ZIP code",
      });
    }


    if (
      dietaryPreferences !== undefined &&
      (
        dietaryPreferences === null ||
        typeof dietaryPreferences !== "object" ||
        Array.isArray(dietaryPreferences) ||
        [
          "vegetarian",
          "vegan",
          "glutenFree",
          "organic",
          "lowCarb",
          "highProtein"
        ].some(
          (key) => typeof dietaryPreferences[key] !== "boolean"
        )
      )
    ) {
      return res.status(400).json({
        error: "Invalid dietary preferences"
      });
    }
    
    const updatedUser = await prisma.$transaction(async (tx) => {

      const user = await tx.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        defaultZipCode: cleanZipcode,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        defaultZipCode: true,
      },
    });

    if (dietaryPreferences !== undefined) {

      const preferenceData = {
        is_vegetarian: dietaryPreferences.vegetarian,
        is_vegan: dietaryPreferences.vegan,
        is_gluten_free: dietaryPreferences.glutenFree,
        is_organic: dietaryPreferences.organic,

        // Recipe Preferences
        is_low_carb: dietaryPreferences.lowCarb,
        is_high_protein: dietaryPreferences.highProtein,
      };


      const result = await tx.user_preferences.updateMany({
        where: {
          user_id: decoded.id,
        },
        data: preferenceData,
      });

      if (result.count === 0) {
        await tx.user_preferences.create({
          data: {
            user_id: decoded.id,
            ...preferenceData,
          },
        });
      }
    }

    return user;
    });

    

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          zipcode: updatedUser.defaultZipCode,
        },
      },
    });

  } catch (error) {

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    if (error.code === "P2025") {
      return res.status(401).json({
        error: "User not found",
      });
    }

    console.error("Profile update failed:", error );

    return res.status(500).json({
      error: "Unable to update profile",
    });
  }
}

// PATCH /auth/notifications
// save the authenticated user's notification preferences
const saveNotificationPreferences = async (req, res) => {
  try {

    // 1. verify authentication
    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if (!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof decoded !== "object" ||
      !Number.isInteger(decoded.id) ||
      decoded.id < 1
    ) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // 2. retrieve not. preferences
    const notificationPreferences = req.body?.notificationPreferences;
    
    //3. validate settings
    const requiredSettings = [
      "emailNotifications",
      "recipeRecommendations",
      "localFoodEvents",
      "newResources",
    ];

    if (
      !notificationPreferences || 
      typeof notificationPreferences !== "object" ||
      Array.isArray(notificationPreferences) ||
      Object.keys(notificationPreferences).length !== requiredSettings.length ||
      requiredSettings.some(
        (key) => typeof notificationPreferences[key] !== "boolean"
      )
    ) {
      return res.status(400).json({
        error: "Invalid notification preferences",
      });
    }

    // 4. save preferences using prisma

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User account not found",
      });
    }

    //camel case but db is in snake_case

    const notificationData  = {
      email_notifications:
        notificationPreferences.emailNotifications,

      recipe_recommendations:
        notificationPreferences.recipeRecommendations,

      local_food_events:
        notificationPreferences.localFoodEvents,

      new_resources: 
        notificationPreferences.newResources,
    };

    const result = await prisma.user_preferences.updateMany({
      where: {
        user_id: decoded.id,
      },
      data: notificationData,
    });

    if (result.count === 0) {
      await prisma.user_preferences.create({
        data: {
          user_id: decoded.id,
          ...notificationData,
        },
      });
    }


     // 5. return success 

     return res.status(200).json({
      status: "success",
      message: "Your notification preferences were saved successfully!",
     });


  } catch (error) {

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    console.error("Notification preferences update failed:", error);

    return res.status(500).json({
      error: "Unable to save notification preferences",
    });

  }

};


// PATCH /auth/password
// Change the authenticated user pass.
const changePassword = async (req, res) => {
  try {
    // Step 1: Verify authentication

    // Retrieve authentication cookie
    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if (!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
  );

  if (
      typeof decoded !== "object" ||
      !Number.isInteger(decoded.id) ||
      decoded.id < 1
    ) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // Step 2: Retrieve current and new passwords

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body || {};

    // Step 3: Validate the new password
    // Validation of required fields on password 
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string" ||
      !currentPassword ||
      !newPassword ||
      !confirmPassword 
    ) {
      return res.status(400).json({
        error: "All password fields are required",
      });
    }

    // verify password confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "New passwords do not match",
      });
    } 

    if (newPassword.length < 12 ) {
    
      return res.status(400).json ({
        error: "Your password must contain at least 12 characters.",
      });
    }

    // check max password length
    if (Buffer.byteLength(newPassword, "utf-8") > 72 ){
      return res.status(400).json({
        error: "Your password is too long. Please choose a shorter password.",
      });
    }
    // Step 4: Verify the current password using bcrypt

    //retrieve the authenticated users' pass hash
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    // check if the account still exists
    if (!user) {
      return res.status(401).json({
        error: "User account not found.",
      });
    }

    // compare the entered pass with the stored hash
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    // prevent reuse current pass
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

    if (isSamePassword) {
      return res.status(400).json({
        error: "Please choose a different password from your current one.",
      });
    }



    // Step 5: Hash and save the new password

    // hash the new pass before storing it 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password only if the stored hash has not changed 
    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        passwordHash: user.passwordHash,
      },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      },
    });

    // check wheter the pass was updated 
    if (result.count !== 1) {
      return res.status(409).json({
        error: "Your password has changed. Please sign in again and retry.",
      });
    }

    // Step 6: Return success response

    return res.status(200).json({
      status: "success",
      message: "Your password was updated successfully!",
    });


  } catch (error) {

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    console.error("Password change failed:", error);

    return res.status(500).json({
      error: "Unable to update password",
    });

  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  saveNotificationPreferences,
};
