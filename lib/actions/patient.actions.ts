"use server"

import { ID, Query } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
    try {
      // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
      const newUser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );

      console.log({newUser})
  
      return parseStringify(newUser);
    } catch (error: any) {
      // Check existing user
      if (error && error?.code === 409) {
        const documents = await users.list([
          Query.equal("email", [user.email]),
        ]);
  
        return documents?.users[0];
      }
      console.error("An error occurred while creating a new user:", error);
    }
  };


// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams ) => {
  try {
    let file; 

    if(identificationDocument) {
      const inputFile = InputFile.fromBuffer(
      identificationDocument?.get('blobFie') as Blob,
    identificationDocument?.get('fileName') as string,
  )

  file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
  }

console.log (
  {
    identificationDocumentId: file?.$id || null, 
    identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` ,
    ...patient
  }  
)

  

  const newPatient = await databases.createDocument(
    DATABASE_ID!,
    PATIENT_COLLECTION_ID!,
    ID.unique(),
    {
      identificationDocumentId: file?.$id || null, 
      identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` ,
      ...patient
    }
  )
  } catch (error) {
    console.log(error);
  }
}