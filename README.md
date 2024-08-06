<img width="1200" alt="github photo (2)" src="https://github.com/user-attachments/assets/2ac55f44-e343-4ce0-9e04-98965f7ddbe5">

<br>
<br>
<br>

**[Dubbie](https://dubbie.com) is an open-source AI dubbing studio that costs $0.1/min**, which is about 10-30x less than alternatives like ElevenLabs, RaskAI, or Speechify. While still in early development and not at feature parity with these alternatives, Dubbie offers enough features to create dubs for basic videos.

For questions/thoughts/bugs/contributions, join our [Discord server](https://discord.gg/qJNV93PY2e).

This README focuses on the technical aspects of Dubbie. For more on motivations and mission, see our [manifesto](http://dubbie.com/blog/why).

<br>

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

<br>

## How the initialization process works

1. The user uploads the video and click “create project”
2. Upload the video to firebase storage
3. Extract the audio and upload it to firebase storage as well
4. Transcribe the audio via Whisper
    - Which will give us the entire transcription in a big paragraph, as well as time stamps for each word.
5. Use an LLM to break down the entire paragraph into individual sentences.
6. Match the individual sentences with the word level timestamps to figure out when each sentence begins and ends.
    - Since the LLM output may not be “perfect” match, we will then use an approximation algorithm.
7. Use an LLM to translate each sentence it into the language the user selected.
    - We do this translation chunk by chunk, and use certain techniques to ensure the output matches the input.
8. Use a text to speech API(currently just Azure and OpenAI) to generate audio!
9. Upload those audio files to firebase storage, and save the URLs to our database via Prisma.
10. The frontend client updates and renders all of that so users can preview realtime and edit
  
<br>

## How the frontend editor works
On a high level: there are 3 elements that we need to sync
1. Video element
2. Timeline scrubber
3. Invisible audio player

Tone.js connects individual audio URLs and serves as the main timer. See `useAudioTrack.ts` for implementation details.

## Roadmap

- Fix known bugs
  - Regenerating segment and moving segments sometimes crashes the Next.js app
