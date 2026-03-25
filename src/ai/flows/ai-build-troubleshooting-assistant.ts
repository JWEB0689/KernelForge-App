'use server';
/**
 * @fileOverview An AI assistant for troubleshooting kernel build logs.
 *
 * - aiBuildTroubleshootingAssistant - A function that analyzes kernel build logs,
 *   identifies errors, and suggests solutions.
 * - AiBuildTroubleshootingAssistantInput - The input type for the aiBuildTroubleshootingAssistant function.
 * - AiBuildTroubleshootingAssistantOutput - The return type for the aiBuildTroubleshootingAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiBuildTroubleshootingAssistantInputSchema = z.object({
  buildLog: z.string().describe('The full kernel build log output.'),
  deviceInfo: z.object({
    model: z.string().optional(),
    codename: z.string().optional(),
    gkiVersion: z.string().optional(),
    kmiVersion: z.string().optional(),
  }).optional().describe('Contextual information about the target device and kernel version.'),
});
export type AiBuildTroubleshootingAssistantInput = z.infer<typeof AiBuildTroubleshootingAssistantInputSchema>;

const AiBuildTroubleshootingAssistantOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the build log analysis.'),
  identifiedErrors: z.array(z.string()).describe('A list of identified errors or warnings in the build log.'),
  suggestedSolutions: z.array(z.string()).describe('A list of suggested solutions or next steps to resolve the identified issues.'),
});
export type AiBuildTroubleshootingAssistantOutput = z.infer<typeof AiBuildTroubleshootingAssistantOutputSchema>;

export async function aiBuildTroubleshootingAssistant(
  input: AiBuildTroubleshootingAssistantInput
): Promise<AiBuildTroubleshootingAssistantOutput> {
  return aiBuildTroubleshootingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBuildTroubleshootingAssistantPrompt',
  input: { schema: AiBuildTroubleshootingAssistantInputSchema },
  output: { schema: AiBuildTroubleshootingAssistantOutputSchema },
  prompt: `You are an expert Android kernel developer and a build troubleshooting assistant.
Your task is to analyze the provided kernel build logs for issues, identify common errors or warnings, and suggest specific solutions or next steps.

Focus on issues related to:
- LineageOS kernel compilation for high-end SoCs (like SM8550)
- GKI (Generic Kernel Image) compatibility and KMI (Kernel Module Interface) mismatches
- SUSFS and KernelSU/KernelSU-Next integration patches
- Filesystem hiding patches, specifically maxsteeel's "NoMount" patches
- AnyKernel3 packaging and ZIP generation errors

{{#if deviceInfo}}
Target Context:
- Device: {{{deviceInfo.model}}} ({{{deviceInfo.codename}}})
- GKI Version: {{{deviceInfo.gkiVersion}}}
- KMI Version: {{{deviceInfo.kmiVersion}}}
{{/if}}

Here are the build logs:

{{{buildLog}}}

Based on the logs and context provided, please provide:
1. A summary of the build status and any critical issues.
2. A list of specific errors or warnings you identified, particularly those related to KMI/GKI compatibility, patch integration (NoMount/SUSFS), or AnyKernel3 packaging.
3. Actionable solutions or next steps to resolve each identified issue.

Respond strictly in the JSON format defined by the output schema, ensuring all fields are populated.
`,
});

const aiBuildTroubleshootingAssistantFlow = ai.defineFlow(
  {
    name: 'aiBuildTroubleshootingAssistantFlow',
    inputSchema: AiBuildTroubleshootingAssistantInputSchema,
    outputSchema: AiBuildTroubleshootingAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
