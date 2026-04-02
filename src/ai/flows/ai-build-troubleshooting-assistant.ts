/**
 * @fileOverview A Mock AI assistant for troubleshooting kernel build logs since the app is exported as a static Android APK.
 */

export const AiBuildTroubleshootingAssistantInputSchema = {
  buildLog: 'string',
  deviceInfo: 'object',
};

export type AiBuildTroubleshootingAssistantInput = {
  buildLog: string;
  deviceInfo?: {
    model?: string;
    codename?: string;
    gkiVersion?: string;
    kmiVersion?: string;
  };
};

export const AiBuildTroubleshootingAssistantOutputSchema = {
  summary: 'string',
  identifiedErrors: 'array',
  suggestedSolutions: 'array',
};

export type AiBuildTroubleshootingAssistantOutput = {
  summary: string;
  identifiedErrors: string[];
  suggestedSolutions: string[];
};

export async function aiBuildTroubleshootingAssistant(
  input: AiBuildTroubleshootingAssistantInput
): Promise<AiBuildTroubleshootingAssistantOutput> {
  // Mock response for the static export
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: "This is a simulated AI analysis since the application is running in static export mode (Android APK) without a backend server.",
        identifiedErrors: [
          "Cannot reach AI server locally without backend."
        ],
        suggestedSolutions: [
          "Provide a remote AI endpoint if you wish to analyze logs inside the Android APK."
        ]
      });
    }, 2000);
  });
}
