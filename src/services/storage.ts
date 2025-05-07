
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

export const uploadImage = async (
  bucketName: string,
  file: File,
  folderPath: string = ""
): Promise<string> => {
  try {
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
    
    // Upload the file to the specified bucket
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadCompetitorImage = async (file: File): Promise<string> => {
  return uploadImage('competitor_images', file);
};

export const uploadProjectImage = async (file: File): Promise<string> => {
  return uploadImage('project_images', file);
};

export const uploadAdImage = async (file: File): Promise<string> => {
  return uploadImage('ad_images', file);
};
