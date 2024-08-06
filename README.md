![Social photo (1)](https://github.com/user-attachments/assets/05032873-186a-4ace-acc7-28e3f93a3921)
# Dubbie: Open-Source AI Dubbing Studio

Dubbie is an open-source AI dubbing studio that costs $0.1/min, which is about 10-30x less than alternatives like ElevenLabs, RaskAI, or Speechify. While still in early development and not at feature parity with these alternatives, Dubbie offers enough features to create dubs for basic videos.

This README focuses on the technical aspects of Dubbie. For more on motivations and mission, see our [manifesto](http://dubbie.com/blog/why). For questions/thoughts/bugs, email [chen@dubbie.com](mailto:chen@dubbie.com) or join our [Discord server](https://discord.gg/qJNV93PY2e).

## Tech Stack

- **NextJS 14**: Client app (app.dubbie.com)
- **Node**: Longer running functions (initialization/exporting)
- **Openrouter**: LLM selection for best-fit tasks
- **Azure/OpenAI**: Voice generation
- **Prisma**: Database interface (Postgres)
- **Firebase**: Storage
- **Clerk**: User authentication
- **Stripe**: Payments
- **ShadcnUI**: Some UI components

Note: These choices reflect personal preference/experience rather than being definitively "best".

## Dubbing Process

1. User uploads video and creates project
2. Video uploaded to Firebase storage
3. Audio extracted and uploaded to Firebase storage
4. Audio transcribed using Whisper
5. LLM breaks transcription into individual sentences
6. Sentences matched with word-level timestamps
7. LLM translates sentences to selected language
8. Text-to-speech API (Azure/OpenAI) creates audio
9. Audio uploaded to Firebase, URL saved to database

## Editor Functionality

Three elements to sync:
1. Video element
2. Timeline scrubber
3. Invisible audio player

Tone.js connects individual audio URLs and serves as the main timer. See `useAudioTrack.ts` for implementation details.

## Roadmap

- Fix known bugs
  - Regenerating segment and moving segments sometimes crashes the Next.js app
