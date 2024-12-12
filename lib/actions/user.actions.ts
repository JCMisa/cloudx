"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      // select all
      appwriteConfig.databaseId, // from this database
      appwriteConfig.usersCollectionId, // specifically in the users table/collection
      [Query.equal("email", [email])] // where email property is equal to email the we passed in the parameter
    );

    return result?.total > 0 ? result?.documents[0] : null;
  } catch (error) {
    handleError(error, "Failed to fetch user by email");
    return null;
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email); // create a unique OTP for the passed user and send it
    return session?.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
    return null;
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");
    if (!existingUser) {
      const { databases } = await createAdminClient();
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar: "/avatar-placeholder.png",
          accountId,
        }
      );
    }
    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to create account");
    return null;
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string | null;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId as string, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user?.total <= 0) return null;
    return parseStringify(user?.documents[0]);
  } catch (error) {
    console.error("Error fetching current user: ", error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    // Delete the current session
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser?.accountId });
    }
    return parseStringify({ accountId: null, error: "User Not Found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
    return null;
  }
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
