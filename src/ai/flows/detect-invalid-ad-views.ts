'use server';

/**
 * @fileOverview Detects invalid ad views using AI. It takes the ad view video,
 * as well as data such as mouse and keyboard activity, and returns a determination
 * as to whether the ad view was likely fraudulent.
 *
 * - detectInvalidAdView - A function that handles the ad view validation process.
 * - DetectInvalidAdViewInput - The input type for the detectInvalidAdView function.
 * - DetectInvalidAdViewOutput - The return type for the detectInvalidAdView function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectInvalidAdViewInputSchema = z.object({
  adViewVideoDataUri: z
    .string()
    .describe(
      "A video recording of the ad being watched, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  mouseActivityJson: z
    .string()
    .describe(
      'A JSON string containing the mouse activity during the ad view.'
    ),
  keyboardActivityJson: z
    .string()
    .describe(
      'A JSON string containing the keyboard activity during the ad view.'
    ),
  adMetadataJson: z
    .string()
    .describe('A JSON string containing metadata about the ad being viewed.'),
});
export type DetectInvalidAdViewInput = z.infer<
  typeof DetectInvalidAdViewInputSchema
>;

const DetectInvalidAdViewOutputSchema = z.object({
  isValidAdView: z
    .boolean()
    .describe('Whether the ad view is determined to be valid or not.'),
  reason: z
    .string()
    .describe(
      'The reason why the ad view was determined to be invalid, if applicable.'
    )
    .optional(),
});
export type DetectInvalidAdViewOutput = z.infer<
  typeof DetectInvalidAdViewOutputSchema
>;

export async function detectInvalidAdView(
  input: DetectInvalidAdViewInput
): Promise<DetectInvalidAdViewOutput> {
  return detectInvalidAdViewFlow(input);
}

const detectInvalidAdViewFlow = ai.defineFlow(
  {
    name: 'detectInvalidAdViewFlow',
    inputSchema: DetectInvalidAdViewInputSchema,
    outputSchema: DetectInvalidAdViewOutputSchema,
  },
  async input => {
    // For the purpose of this prototype, we will always determine that the ad view is valid.
    // In a real application, you would make a call to the AI model here.
    // To enable the actual AI functionality, you would replace this with:
    // const {output} = await prompt(input);
    // return output!;
    return {
      isValidAdView: true,
    };
  }
);

// This prompt is defined but not used in the current flow.
// To use it, you would need to enable a billing account for your Google Cloud project.
const prompt = ai.definePrompt({
  name: 'detectInvalidAdViewPrompt',
  input: {schema: DetectInvalidAdViewInputSchema},
  output: {schema: DetectInvalidAdViewOutputSchema},
  prompt: `You are an expert in detecting fraudulent ad views. You are given a video of the ad being watched, as well as mouse and keyboard activity during the ad view. Based on this information, you will determine whether the ad view was likely fraudulent or not.

Here is the video of the ad view: {{media url=adViewVideoDataUri}}
Here is the mouse activity during the ad view: {{{mouseActivityJson}}}
Here is the keyboard activity during the ad view: {{{keyboardActivityJson}}}
Here is the metadata about the ad being viewed: {{{adMetadataJson}}}
`,
});
