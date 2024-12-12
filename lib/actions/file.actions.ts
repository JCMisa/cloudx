"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name); // generate a blob format of the file and the file name that is passed

    //store the file to the bucket
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId, // upload to the bucket based on the bucketId configuration
      ID.unique(), // pass the unique ID
      inputFile // pass the file that will be uploaded to the bucket
    );

    const fileDocument = {
      type: getFileType(bucketFile?.name)?.type,
      name: bucketFile?.name,
      url: constructFileUrl(bucketFile?.$id),
      extension: getFileType(bucketFile?.name)?.extension,
      size: bucketFile?.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileIds: bucketFile?.$id,
    };

    // store the file's metadata in the fileCollection table
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile?.$id);
        handleError(error, "Failed to store file document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload files");
  }
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
