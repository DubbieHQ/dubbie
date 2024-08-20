"use server";
import { AcceptedLanguage, MediaType, prisma } from "@dubbie/db";
import { fetchUserSubscriptionInfo } from "@/lib/actions/fetchSubscriptionInfo";
import { currentUser } from "@clerk/nextjs/server";
import { getDefaultVoiceForLanguage } from "@dubbie/shared/languages";

export type CreateProjectErrorCode =
  | "USER_NOT_FOUND"
  | "INSUFFICIENT_CREDITS"
  | "INTERNAL_ERROR";

interface CreateProjectError {
  code: CreateProjectErrorCode;
  message: string;
}

interface CreateProjectResult {
  projectId?: string;
  error?: CreateProjectError;
}

interface CreateProjectParams {
  url: string;
  name: string;
  targetLanguage: AcceptedLanguage;
  thumbnailUrl: string;
  originalMediaType: MediaType;
  audioDurationInSeconds: number;
  voiceName: string;
  voiceProvider: string;
  extractBackgroundAudio?: boolean;
}

export async function createProject({
  url,
  name,
  targetLanguage,
  thumbnailUrl,
  originalMediaType,
  audioDurationInSeconds,
  voiceName,
  voiceProvider,
  extractBackgroundAudio,
}: CreateProjectParams): Promise<CreateProjectResult> {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      };
    }

    const { remainingCredits } = await fetchUserSubscriptionInfo();
    if (remainingCredits * 60 < audioDurationInSeconds) {
      return {
        error: {
          code: "INSUFFICIENT_CREDITS",
          message: "Not enough credits",
        },
      };
    }

    const { id: projectId } = await prisma.project.create({
      data: {
        originalUrl: url,
        originalMediaType,
        userId: user.id,
        targetLanguage,
        name,
        thumbnailUrl,
        audioDurationInSeconds,
        defaultVoiceName: voiceName,
        defaultVoiceProvider: voiceProvider,
        extractBackgroundAudio,
      },
    });

    return { projectId };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal error occurred while creating the project",
      },
    };
  }
}
